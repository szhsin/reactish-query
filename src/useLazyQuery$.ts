import type { QueryTrigger, LazyQueryHookOptions, QueryHookOptions } from './types';
import { useQuery$ } from './useQuery$';

/**
 * Low-level, composable lazy-query hook.
 *
 * Purpose: provide observable slices (and a `trigger`) for lazy queries so
 * consumers can compose custom hooks. Use with helpers from `useObservable.ts`.
 *
 * Enable fine-grained reactivity: composing with a single helper subscribes only to
 * that slice. Example: `useData(useLazyQuery$(opts))` rerenders only when
 * `data` changes.
 *
 * @example
 *  const useDataAndTrigger = <TData, TArgs, TKey = unknown>(
 *    options: LazyQueryHookOptions<TData, TArgs, TKey>
 *  ) => useData(useLazyQuery$(options));
 */
const useLazyQuery$ = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TArgs, TKey>
) => {
  const { refetch, ...rest } = useQuery$<TData, TKey>({
    ...(options as QueryHookOptions<TData, TKey>),
    enabled: false
  });

  return { ...rest, trigger: refetch as QueryTrigger<TData, TArgs> };
};

export { useLazyQuery$ };
