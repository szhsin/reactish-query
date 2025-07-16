import type { FetchTrigger, LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TParams, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TParams>) => readonly [FetchTrigger<TData, TParams>, {
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
}];
export { useLazyQuery };
