import type { QueryHookOptions, QueryHookResult } from './types';
import { UNDEFINED } from './utils';
import { useQuery$ } from './useQuery$';
import { useObservable } from './useObservable';

const useQuery = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
  const result = useObservable(useQuery$(options));

  return {
    ...result,
    isPending: result.data === UNDEFINED && !result.error
  } as QueryHookResult<TData>;
};

export { useQuery };
