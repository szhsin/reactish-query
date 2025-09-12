import type { QueryHookOptions } from './types';
import { useData } from './useObservable';
import { useQuery$ } from './useQuery$';

/**
 * Convenience hook that returns only `data` and `isPending` from `useQuery$`.
 * Useful for components that only care about the query result and pending
 * state, and don't need `error` or `isFetching`.
 */
const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
  useData(useQuery$(options));

export { useQueryData };
