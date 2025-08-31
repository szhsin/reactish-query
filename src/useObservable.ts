import { useSnapshot } from 'reactish-state';
import type { QueryDataState } from './types';
import type { InternalHookApi } from './types-internal';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type InputState = { _: InternalHookApi<any> };

type ExtractDataType<TInput> = TInput extends {
  _: InternalHookApi<infer TData>;
}
  ? TData
  : never;

const useData = <TInput extends InputState>(input: TInput) =>
  ({
    ...input,
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    data: useSnapshot(input._.s.d),
    isPending: useSnapshot(input._.s.p)
  }) as TInput & QueryDataState<ExtractDataType<TInput>>;

const useError = <TInput extends InputState>(input: TInput) => ({
  ...input,
  error: useSnapshot(input._.s.e)
});

const useIsFetching = <TInput extends InputState>(input: TInput) => ({
  ...input,
  isFetching: useSnapshot(input._.s.f)
});

const useObservable = <TInput extends InputState>(input: TInput) =>
  useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
