import { useSnapshot } from 'reactish-state';
import type { QueryHookOptions, QueryHookResult } from './types';
import { UNDEFINED } from './utils';
import { useQuery$ } from './useQuery$';

const useQuery = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
  const {
    _: { p: isFetching$, d: data$, e: error$ },
    ...rest
  } = useQuery$(options);

  const data = useSnapshot(data$);
  const error = useSnapshot(error$);

  return {
    data,
    error,
    isFetching: useSnapshot(isFetching$),
    isPending: data === UNDEFINED && !error,
    ...rest
  } as QueryHookResult<TData>;
};

export { useQuery };
