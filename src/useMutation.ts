import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

const useMutation = <TData, TKey = unknown, TParams = unknown>(
  key: TKey,
  options: MutationHookOptions<TData, TKey, TParams>
) =>
  useLazyQuery<TData, TKey, TParams>(key, {
    ...(options as LazyQueryHookOptions<TData, TKey, TParams>),
    cacheMode: 'off'
  });

export { useMutation };
