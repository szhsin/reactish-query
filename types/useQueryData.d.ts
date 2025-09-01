import type { QueryHookOptions } from './types';
declare const useQueryData: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    refetch: import("./types").Refetch<TData>;
} & import("./types-internal").InternalHookApi<TData> & import("./types").QueryDataState<TData>;
export { useQueryData };
