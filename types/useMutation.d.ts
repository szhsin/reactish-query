import type { MutationHookOptions } from './types';
declare const useMutation: <TData, TParams, TKey = unknown>(options: MutationHookOptions<TData, TKey, TParams>) => readonly [import("./types").FetchTrigger<TData, TParams>, {
    isPending: true;
    isFetching: boolean;
    data?: undefined;
    error?: undefined;
} | {
    isPending: false;
    isFetching: boolean;
    data?: undefined;
    error: Error;
} | {
    isPending: false;
    isFetching: boolean;
    data: TData;
    error?: undefined;
}];
export { useMutation };
