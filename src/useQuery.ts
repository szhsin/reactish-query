import type { QueryHookOptions } from './types';
import { useQuery$ } from './useQuery$';
import { useObservable } from './useObservable';

/**
 * React hook that exposes the full observable query API.
 *
 * Returns an object containing `data`, `error`, `isFetching`, `isPending`,
 * and `refetch`. Use this for components that need the full query lifecycle
 * state and metadata.
 */
const useQuery = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
  useObservable(useQuery$(options));

export { useQuery };
