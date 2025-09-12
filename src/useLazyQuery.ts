import type { LazyQueryHookOptions } from './types';
import { useLazyQuery$ } from './useLazyQuery$';
import { useObservable } from './useObservable';

const useLazyQuery = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TArgs, TKey>
) => useObservable(useLazyQuery$(options));

export { useLazyQuery };
