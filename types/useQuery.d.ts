import type { QueryHookOptions } from './types';
/**
 * React hook that exposes the full observable query API.
 *
 * Returns an object containing `data`, `error`, `isFetching`, `isPending`,
 * and `refetch`. Use this for components that need the full query lifecycle
 * state and metadata.
 */
declare const useQuery: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    refetch: import("./types").Refetch<TData>;
} & import("./types-internal").InternalHookApi<TData> & ({
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>));
export { useQuery };
