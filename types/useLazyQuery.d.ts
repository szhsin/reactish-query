import type { LazyFetch, LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TKey = unknown, TParams = unknown>(key: TKey, options: LazyQueryHookOptions<TData, TKey, TParams>) => readonly [LazyFetch<TData, TParams>, {
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
}];
export { useLazyQuery };
