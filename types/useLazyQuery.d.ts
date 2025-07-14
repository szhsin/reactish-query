import type { LazyFetch, LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TParams, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TParams>) => readonly [LazyFetch<TData, TParams>, {
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
}];
export { useLazyQuery };
