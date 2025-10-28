import { useLayoutEffect as _useLayoutEffect, useEffect, useState } from 'react';
import type { State, StateListener } from 'reactish-state';
import type { QueryObserverOptions, ObserverMeta, MiddlewareMeta } from '../types';
import type {
  QueryCacheEntry,
  InputQueryResult,
  ExtractInputType,
  ExtractInputArgsType
} from '../types-internal';

const useLayoutEffect = typeof window !== 'undefined' ? _useLayoutEffect : useEffect;

/**
 * Attach observers to a query observable.
 *
 * Usage: compose with a query or mutation hook to run callbacks when data or
 * error updates. Observers run synchronously with state updates and are
 * unsubscribed automatically.
 *
 * @example
 *  const useQueryWithObserver = <TData, TKey = unknown>({
 *    onData,
 *    onError,
 *    ...options
 *  }: QueryHookOptions<TData, TKey> & QueryObserverOptions<TData>) =>
 *    useQueryObserver(useQuery(options), { onData, onError });
 */
const useQueryObserver = <TInput extends InputQueryResult & { args?: unknown }>(
  input: TInput,
  {
    onData,
    onError
  }: QueryObserverOptions<
    ExtractInputType<TInput>['data'],
    ExtractInputType<TInput>['queryKey'],
    ExtractInputArgsType<TInput>
  >
) => {
  type Data = ExtractInputType<TInput>['data'];
  const queryCacheEntry$ = input._.$ as State<QueryCacheEntry<Data>>;
  const [context] = useState<{
    /** @internal Array of unsubscribe functions for query state */
    a?: (() => void)[];

    /** @internal Stable reference to the onData handler */
    d?: typeof onData;

    /** @internal Stable reference to the onError handler */
    e?: typeof onError;
  }>({});

  useLayoutEffect(() => {
    context.d = onData;
    context.e = onError;
  }, [context, onData, onError]);

  useLayoutEffect(() => {
    const unsubscribeState = () => context.a?.forEach((unsubscribe) => unsubscribe());

    const listener: StateListener<QueryCacheEntry<Data>> = ([
      { d: data$, e: error$, p: isPending$ }
    ]) => {
      unsubscribeState();

      // Metadata is immutable per cache entry and identical across all state keys.
      // Safe to extract once here and reuse later.
      const { stateKey: _1, ...restData } = data$.meta() as MiddlewareMeta;
      const metadata = restData as ObserverMeta<
        ExtractInputType<TInput>['queryKey'],
        ExtractInputArgsType<TInput>
      >;

      context.a = [
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        data$.subscribe((data) => context.d?.(data!, metadata)),
        error$.subscribe((error) => error && context.e?.(error, metadata))
      ];

      // Manually call the handlers if data or error are already available on mount
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      if (!isPending$.get()) context.d?.(data$.get()!, metadata);
      if (error$.get()) context.e?.(error$.get()!, metadata);
    };

    // If the cache entry was already resolved before this useLayoutEffect runs,
    // we need to manually call the listener once to subscribe to the data and error observable slices.
    // This edge case has only been observed in React's Strict Mode.
    const queryCacheEntry = queryCacheEntry$.get();
    if (queryCacheEntry[0].r) listener(queryCacheEntry, queryCacheEntry);

    const unsubscribeCacheEntry = queryCacheEntry$.subscribe(listener);

    return () => {
      unsubscribeState();
      unsubscribeCacheEntry();
    };
  }, [context, queryCacheEntry$]);

  return input;
};

export { useQueryObserver };
