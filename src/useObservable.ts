import { useSnapshot } from 'reactish-state';
import type { QueryDataState } from './types';
import type { InputQueryResult, ExtractInputDataType } from './types-internal';

const useData = <TInput extends InputQueryResult>(input: TInput) =>
  ({
    ...input,
    data: useSnapshot(input._.s.d) as unknown,
    isPending: useSnapshot(input._.s.p)
  }) as TInput & QueryDataState<ExtractInputDataType<TInput>>;

const useError = <TInput extends InputQueryResult>(input: TInput) => ({
  ...input,
  error: useSnapshot(input._.s.e)
});

const useIsFetching = <TInput extends InputQueryResult>(input: TInput) => ({
  ...input,
  isFetching: useSnapshot(input._.s.f)
});

const useObservable = <TInput extends InputQueryResult>(input: TInput) =>
  useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
