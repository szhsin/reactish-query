import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

const useMutation = <TData, TKey = unknown, TParams = unknown>(
  options: MutationHookOptions<TData, TKey, TParams>
) =>
  useLazyQuery<TData, TKey, TParams>({
    ...(options as LazyQueryHookOptions<TData, TKey, TParams>),
    cacheMode: 'off'
  });

export { useMutation };
