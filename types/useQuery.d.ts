import type { QueryHookOptions } from './types';
declare const useQuery: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    refetch: import("./types").Refetch<TData>;
} & import("./types-internal").InternalHookApi<TData> & ({
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>));
export { useQuery };
