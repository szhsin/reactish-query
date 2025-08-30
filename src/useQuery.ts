import type { QueryHookOptions } from './types';
import { useQuery$ } from './useQuery$';
import { useObservable } from './useObservable';

const useQuery = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
  useObservable(useQuery$(options));

export { useQuery };
