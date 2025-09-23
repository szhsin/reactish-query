import { useCallback } from 'react';
import type { Refetch, QueryHookOptions } from './types';
import { useQueryCore } from './useQueryCore';

/**
 * Low-level query hook for building custom abstractions.
 *
 * Exposes observable slices of query state so consumers can compose their own
 * hooks. Pair with helpers from `useObservable.ts` (e.g. `useData`, `useError`,
 * `useIsFetching`) to select specific slices.
 *
 * Enables fine-grained reactivity: combining a `$` hook with a single helper
 * subscribes only to that slice. For example,
 * `useData(useQuery$(options))` rerenders only when `data` changes (not when
 * `isFetching` or `error` updates).
 *
 * @returns An object containing:
 *  - `refetch` — function to refetch the query
 *
 * @example
 * const { data, refetch } = useData(useQuery$({ queryKey: 'todos', queryFn }));
 * const { data, error, refetch } = useData(useError(useQuery$({ queryKey: 'todos', queryFn })));
 * // or make it reusable
 * const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
 *   useData(useQuery$(options));
 */
const useQuery$ = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
  const internalApi = useQueryCore(options);
  const fetchFn = internalApi.f as Refetch<TData>;

  return {
    /** Function to manually refetch the query */
    refetch: useCallback(() => fetchFn(), [fetchFn]),

    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: internalApi
  };
};

export { useQuery$ };
