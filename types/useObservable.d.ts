import type { QueryDataState } from './types';
import type { InputQueryResult, ExtractInputDataType } from './types-internal';
declare const useData: <TInput extends InputQueryResult>(input: TInput) => TInput & QueryDataState<ExtractInputDataType<TInput>>;
declare const useError: <TInput extends InputQueryResult>(input: TInput) => TInput & {
    error: Error | undefined;
};
declare const useIsFetching: <TInput extends InputQueryResult>(input: TInput) => TInput & {
    isFetching: boolean;
};
declare const useObservable: <TInput extends InputQueryResult>(input: TInput) => TInput & {
    isFetching: boolean;
} & {
    error: Error | undefined;
} & QueryDataState<ExtractInputDataType<TInput & {
    isFetching: boolean;
} & {
    error: Error | undefined;
}>>;
export { useData, useError, useIsFetching, useObservable };
