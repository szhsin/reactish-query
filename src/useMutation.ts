import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

/**
 * Hook for mutations. Internally implemented as a lazy query with cache
 * disabled. Returns the same API as `useLazyQuery` (trigger + observable state).
 */
const useMutation = <TData, TArgs, TKey = unknown>(
  options: MutationHookOptions<TData, TArgs, TKey>
) =>
  useLazyQuery<TData, TArgs, TKey>({
    ...(options as LazyQueryHookOptions<TData, TArgs, TKey>),
    cacheMode: 'off'
  });

export { useMutation };
