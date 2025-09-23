import { useCallback } from 'react';
import type { QueryTrigger, LazyQueryHookOptions, QueryHookOptions } from './types';
import { useQueryCore } from './useQueryCore';

/**
 * Low-level lazy-query hook for building custom abstractions.
 *
 * Exposes observable slices of query state and a `trigger` function for running
 * the query on demand. Pair with helpers from `useObservable.ts` (e.g. `useData`,
 * `useError`, `useIsFetching`) to select specific slices.
 *
 * Enables fine-grained reactivity: combining with a single helper subscribes
 * only to that slice. For example,
 * `useData(useLazyQuery$(options))` rerenders only when `data` changes (not when
 * `isFetching` or `error` updates).
 *
 * @returns An object containing:
 *  - `trigger` — function to manually execute the query
 *  - `args` — the most recent arguments passed to `trigger`
 *
 * @example
 * const { data, trigger } = useData(useLazyQuery$({ queryFn }));
 * const { data, error, trigger } = useData(useError(useLazyQuery$({ queryFn })));
 * // or make it reusable
 * const useDataAndTrigger = <TData, TArgs, TKey = unknown>(
 *   options: LazyQueryHookOptions<TData, TArgs, TKey>
 * ) => useData(useLazyQuery$(options));
 */
const useLazyQuery$ = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TArgs, TKey>
) => {
  const internalApi = useQueryCore<TData, TKey>({
    ...(options as QueryHookOptions<TData, TKey>),
    enabled: false
  });
  const fetchFn = internalApi.f as QueryTrigger<TData, TArgs>;

  return {
    /**
     * Function to manually execute the query.
     * Accepts an argument which will be passed to `queryFn`.
     */
    trigger: useCallback<QueryTrigger<TData, TArgs>>((args) => fetchFn(args), [fetchFn]),

    /** The most recent arguments passed to `trigger`. */
    args: internalApi.s.a as TArgs | undefined,

    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: internalApi
  };
};

export { useLazyQuery$ };
