import type { MutationHookOptions } from './types';
declare const useMutation: <TData, TArgs, TKey = unknown>(options: MutationHookOptions<TData, TKey, TArgs>) => readonly [import("./types").QueryTrigger<TData, TArgs>, {
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
