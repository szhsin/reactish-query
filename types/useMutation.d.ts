import type { MutationHookOptions } from './types';
declare const useMutation: <TData, TKey = unknown, TParams = unknown>(key: TKey, options: MutationHookOptions<TData, TKey, TParams>) => readonly [import("./types").LazyFetch<TData, TParams>, {
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
}];
export { useMutation };
