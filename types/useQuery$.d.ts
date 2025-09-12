import type { Refetch, QueryHookOptions } from './types';
import type { InternalHookApi } from './types-internal';
/**
 * Low-level, composable query hook.
 *
 * Purpose: expose observable slices of a query so consumers can compose custom
 * hooks. Use with helpers from `useObservable.ts` (for example `useData`,
 * `useError`, `useIsFetching`, or `useObservable`).
 *
 * Enable fine-grained reactivity: composing a `$` hook with a single helper subscribes
 * only to that slice. For example, `useData(useQuery$(opts))` rerenders only
 * when `data` changes (not when `isFetching` or `error` update), enabling more
 * granular renders.
 *
 * @example
 *  const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
 *    useData(useQuery$(options));
 */
declare const useQuery$: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => {
    refetch: Refetch<TData>;
} & InternalHookApi<TData>;
export { useQuery$ };
