import type { QueryHookOptions } from './types';
import type { InternalHookApi } from './types-internal';
/**
 * Low-level core hook for building custom abstractions.
 *
 * Exposes observable slices of query state so consumers can compose their own
 * hooks.
 *
 * Enables fine-grained reactivity: combining a `$` hook with a single helper
 * subscribes only to that slice.
 */
declare const useQueryCore: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => InternalHookApi<TData>["_"];
export { useQueryCore };
