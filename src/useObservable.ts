import { useSnapshot } from 'reactish-state';
import type { QueryDataState } from './types';
import type { CacheEntryState } from './types-internal';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type InputState = { _: CacheEntryState<any> };

type ExtractDataType<TInput> = TInput extends {
  _: CacheEntryState<infer TData>;
}
  ? TData
  : never;

const useData = <TInput extends InputState>(input: TInput) =>
  ({
    ...input,
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    data: useSnapshot(input._.d),
    isPending: useSnapshot(input._.p)
  }) as TInput & QueryDataState<ExtractDataType<TInput>>;

const useError = <TInput extends InputState>(input: TInput) => ({
  ...input,
  error: useSnapshot(input._.e)
});

const useIsFetching = <TInput extends InputState>(input: TInput) => ({
  ...input,
  isFetching: useSnapshot(input._.f)
});

const useObservable = <TInput extends InputState>(input: TInput) =>
  useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
