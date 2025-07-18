import type { MutationHookOptions } from './types';
declare const useMutation: <TData, TParams, TKey = unknown>(options: MutationHookOptions<TData, TKey, TParams>) => readonly [import("./types").FetchTrigger<TData, TParams>, {
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
}];
export { useMutation };
