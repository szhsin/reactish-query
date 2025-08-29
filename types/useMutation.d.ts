import type { MutationHookOptions } from './types';
declare const useMutation: <TData, TArgs, TKey = unknown>(options: MutationHookOptions<TData, TKey, TArgs>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    isPending: true;
    isFetching: boolean;
    data?: undefined;
    error?: undefined;
} | {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    isPending: false;
    isFetching: boolean;
    data?: undefined;
    error: Error;
} | {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    isPending: false;
    isFetching: boolean;
    data: TData;
    error?: undefined;
};
export { useMutation };
