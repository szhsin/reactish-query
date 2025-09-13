import type { LazyQueryHookOptions } from './types';
import { useLazyQuery$ } from './useLazyQuery$';
import { useObservable } from './useObservable';

/**
 * Hook for lazy queries. Returns the same render-ready state as `useQuery`,
 * but does not trigger a declarative (auto) fetch. Use the returned `trigger`
 * to execute the query with arguments.
 *
 * @returns An object containing:
 *  - `trigger` — function to manually execute the query
 *  - `args` — last arguments passed to `trigger`
 *  - `data` — current query result
 *  - `error` — current query error
 *  - `isFetching` — whether the query is in progress
 *  - `isPending` — whether the query is pending
 */
const useLazyQuery = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TArgs, TKey>
) => useObservable(useLazyQuery$(options));

export { useLazyQuery };
