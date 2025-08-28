import type { QueryStateCode, CacheEntryState } from './types-internal';
type InputState = {
    _: CacheEntryState<any>;
};
type StateType<TInput, TCode extends QueryStateCode> = TInput extends {
    _: CacheEntryState<infer TData>;
} ? TCode extends 'd' ? TData | undefined : TCode extends 'e' ? Error | undefined : boolean : never;
declare const useData: <TInput extends InputState>(input: TInput) => TInput & Record<"data", StateType<TInput, "d">>;
declare const useError: <TInput extends InputState>(input: TInput) => TInput & Record<"error", StateType<TInput, "e">>;
declare const useIsFetching: <TInput extends InputState>(input: TInput) => TInput & Record<"isFetching", StateType<TInput, "p">>;
declare const useObservable: <TInput extends InputState>(input: TInput) => TInput & Record<"isFetching", StateType<TInput, "p">> & Record<"error", StateType<TInput & Record<"isFetching", StateType<TInput, "p">>, "e">> & Record<"data", StateType<TInput & Record<"isFetching", StateType<TInput, "p">> & Record<"error", StateType<TInput & Record<"isFetching", StateType<TInput, "p">>, "e">>, "d">>;
export { useData, useError, useIsFetching, useObservable };
