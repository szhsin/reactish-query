import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

/**
 * Hook for mutations. Internally implemented as a lazy query with cache
 * disabled. Returns the same API as `useLazyQuery` (trigger + render-ready state).
 *
 * @returns An object containing:
 *  - `trigger` — function to manually execute the mutation
 *  - `args` — the most recent arguments passed to `trigger`
 *  - `data` — current mutation result
 *  - `error` — current mutation error
 *  - `isFetching` — whether the mutation is in progress
 *  - `isPending` — whether the mutation is pending
 */
const useMutation = <TData, TArgs, TKey = unknown>(
  options: MutationHookOptions<TData, TArgs, TKey>
) =>
  useLazyQuery<TData, TArgs, TKey>({
    ...(options as LazyQueryHookOptions<TData, TArgs, TKey>),
    cacheMode: 'off'
  });

export { useMutation };
