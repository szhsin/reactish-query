import type { QueryHookOptions } from './types';
import { useData } from './useObservable';
import { useQuery$ } from './useQuery$';

const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
  useData(useQuery$(options));

export { useQueryData };
