import type { LazyQueryHookOptions, MutationHookOptions } from './types';
import { useLazyQuery } from './useLazyQuery';

const useMutation = <TData, TArgs, TKey = unknown>(
  options: MutationHookOptions<TData, TArgs, TKey>
) =>
  useLazyQuery<TData, TArgs, TKey>({
    ...(options as LazyQueryHookOptions<TData, TArgs, TKey>),
    cacheMode: 'off'
  });

export { useMutation };
