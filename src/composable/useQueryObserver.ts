import { useLayoutEffect as _useLayoutEffect, useEffect, useState } from 'react';
import type { State } from 'reactish-state';
import type { QueryObserverOptions } from '../types';
import type {
  InputQueryResult,
  ExtractInputDataType,
  QueryCacheEntry
} from '../types-internal';

const useLayoutEffect = typeof window !== 'undefined' ? _useLayoutEffect : useEffect;

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
    const unsubscribeCacheEntry = queryCacheEntry$.subscribe(
      ([{ d: data$, e: error$, p: isPending$ }]) => {
        unsubscribeState();

        context.a = [
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          data$.subscribe((data) => context.d?.(data!)),
          error$.subscribe((error) => error && context.e?.(error))
        ];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        if (!isPending$.get()) context.d?.(data$.get()!);
        if (error$.get()) context.e?.(error$.get()!);
      }
    );
    return () => {
      unsubscribeState();
      unsubscribeCacheEntry();
    };
  }, [context, queryCacheEntry$]);

  return input;
};

export { useQueryObserver };
