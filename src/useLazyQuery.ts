import type { LazyQueryHookOptions } from './types';
import { useLazyQuery$ } from './useLazyQuery$';
import { useObservable } from './useObservable';

/**
 * Hook for lazy queries. Returns the same observable API as `useQuery`, but
 * does not trigger an initial fetch. Use the returned `trigger` to execute the
 * query with arguments.
 */
const useLazyQuery = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TArgs, TKey>
) => useObservable(useLazyQuery$(options));

export { useLazyQuery };
