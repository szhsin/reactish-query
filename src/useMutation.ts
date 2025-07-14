import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

const useMutation = <TData, TParams, TKey = unknown>(
  options: MutationHookOptions<TData, TKey, TParams>
) =>
  useLazyQuery<TData, TParams, TKey>({
    ...(options as LazyQueryHookOptions<TData, TKey, TParams>),
    cacheMode: 'off'
  });

export { useMutation };
