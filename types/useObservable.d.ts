import type { QueryDataState } from './types';
import type { CacheEntryState } from './types-internal';
type InputState = {
    _: CacheEntryState<any>;
};
type ExtractDataType<TInput> = TInput extends {
    _: CacheEntryState<infer TData>;
} ? TData : never;
declare const useData: <TInput extends InputState>(input: TInput) => TInput & QueryDataState<ExtractDataType<TInput>>;
declare const useError: <TInput extends InputState>(input: TInput) => TInput & {
    error: Error | undefined;
};
declare const useIsFetching: <TInput extends InputState>(input: TInput) => TInput & {
    isFetching: boolean;
};
declare const useObservable: <TInput extends InputState>(input: TInput) => TInput & {
    isFetching: boolean;
} & {
    error: Error | undefined;
} & QueryDataState<ExtractDataType<TInput & {
    isFetching: boolean;
} & {
    error: Error | undefined;
}>>;
export { useData, useError, useIsFetching, useObservable };
