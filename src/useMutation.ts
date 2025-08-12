import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

const useMutation = <TData, TArgs, TKey = unknown>(
  options: MutationHookOptions<TData, TKey, TArgs>
) =>
  useLazyQuery<TData, TArgs, TKey>({
    ...(options as LazyQueryHookOptions<TData, TKey, TArgs>),
    cacheMode: 'off'
  });

export { useMutation };
