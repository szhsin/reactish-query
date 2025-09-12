import { useState, useEffect, useCallback } from 'react';
import { state as vanillaState, useSnapshot } from 'reactish-state';
import type { Refetch, CacheQueryFn, QueryMeta, QueryHookOptions } from './types';
import type { QueryCacheEntry, InternalHookApi } from './types-internal';
import { UNDEFINED, stringify } from './utils';
import { fetchCacheEntry } from './queryCacheUtils';
import { useQueryContext } from './useQueryContext';

/**
 * Low-level, composable query hook.
 *
 * Purpose: expose observable slices of a query so consumers can compose custom
 * hooks. Use with helpers from `useObservable.ts` (for example `useData`,
 * `useError`, `useIsFetching`, or `useObservable`).
 *
 * Enable fine-grained reactivity: composing a `$` hook with a single helper subscribes
 * only to that slice. For example, `useData(useQuery$(opts))` rerenders only
 * when `data` changes (not when `isFetching` or `error` update), enabling more
 * granular renders.
 *
 * @example
 *  const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
 *    useData(useQuery$(options));
 */
const useQuery$ = <TData, TKey = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}: QueryHookOptions<TData, TKey>) => {
  const {
    client: {
      _: [createDefaultCacheEntry, resolveCacheEntry]
    },
    defaultOptions
  } = useQueryContext();
  const { cacheMode, staleTime = 0 } = { ...defaultOptions, ...options };
  const strQueryKey = stringify(queryKey);
  const [queryCacheEntry] = useState(() =>
    vanillaState((createDefaultCacheEntry as () => QueryCacheEntry<TData>)())
  );

  const refetch = useCallback(
    async (args: unknown, declarative: boolean) => {
      const queryMeta: QueryMeta = { queryKey, args };

      const cacheEntry =
        cacheMode !== 'off'
          ? resolveCacheEntry(
              queryMeta,
              queryFn as CacheQueryFn<TData>,
              cacheMode === 'persist',
              strQueryKey
            )
          : createDefaultCacheEntry(queryMeta, queryFn as CacheQueryFn<TData>);

      queryCacheEntry.set(cacheEntry);

      const [queryState, cacheMeta] = cacheEntry;

      if (declarative && (queryState.f.get() || Date.now() - staleTime < cacheMeta.t!)) {
        // No return value needed since this is only called inside this query hook when declarative
        return;
      }

      return fetchCacheEntry(queryMeta, cacheEntry);
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [strQueryKey, cacheMode, staleTime]
  );

  useEffect(() => {
    if (enabled) refetch(UNDEFINED, true);
  }, [enabled, refetch]);

  return {
    refetch,
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
      s: useSnapshot(queryCacheEntry)[0],
      $: queryCacheEntry
    }
  } as { refetch: Refetch<TData> } & InternalHookApi<TData>;
};

export { useQuery$ };
