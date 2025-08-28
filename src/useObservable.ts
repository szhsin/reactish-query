import { useSnapshot } from 'reactish-state';
import type { QueryStateCode, CacheEntryState } from './types-internal';
import type { QueryStateKey } from './types';
import { QueryStateMapper } from './utils';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type InputState = { _: CacheEntryState<any> };

type StateType<TInput, TCode extends QueryStateCode> = TInput extends {
  _: CacheEntryState<infer TData>;
}
  ? TCode extends 'd'
    ? TData | undefined
    : TCode extends 'e'
      ? Error | undefined
      : boolean
  : never;

const createObservable =
  <TStateKey extends QueryStateKey, TCode extends QueryStateCode>(code: TCode) =>
  <TInput extends InputState>(input: TInput) =>
    ({
      ...input,
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      [QueryStateMapper[code]]: useSnapshot(input._[code])
    }) as TInput & Record<TStateKey, StateType<TInput, TCode>>;

const useData = createObservable<'data', 'd'>('d');

const useError = createObservable<'error', 'e'>('e');

const useIsFetching = createObservable<'isFetching', 'p'>('p');

const useObservable = <TInput extends InputState>(input: TInput) =>
  useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
