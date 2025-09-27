import { useLayoutEffect as _useLayoutEffect, useEffect, useState } from 'react';
import type { State, StateListener } from 'reactish-state';
import type { QueryObserverOptions } from '../types';
import type {
  InputQueryResult,
  ExtractInputDataType,
  QueryCacheEntry
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
const useQueryObserver = <TInput extends InputQueryResult>(
  input: TInput,
  { onData, onError }: QueryObserverOptions<ExtractInputDataType<TInput>>
) => {
  type Data = ExtractInputDataType<TInput>;
  const queryCacheEntry$ = input._.$ as State<QueryCacheEntry<Data>>;
  const [context] = useState<{
    /** @internal Array of unsubscribe functions for query state */
    a?: (() => void)[];

    /** @internal Stable reference to the onData handler */
    d?: (data: Data) => void;

    /** @internal Stable reference to the onError handler */
    e?: (error: Error) => void;
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

      context.a = [
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        data$.subscribe((data) => context.d?.(data!)),
        error$.subscribe((error) => error && context.e?.(error))
      ];

      // Manually call the handlers if data or error are already available on mount
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      if (!isPending$.get()) context.d?.(data$.get()!);
      if (error$.get()) context.e?.(error$.get()!);
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
