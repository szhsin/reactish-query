import { useState, useCallback, useEffect } from 'react';
import { state as vanillaState, useSnapshot } from 'reactish-state';
import type { CacheQueryFn, QueryMeta, QueryHookOptions } from './types';
import type { QueryCacheEntry, InternalHookApi } from './types-internal';
import { UNDEFINED, stringify } from './utils';
import { fetchCacheEntry } from './queryCacheUtils';
import { useQueryContext } from './useQueryContext';

/**
 * Low-level core hook for building custom abstractions.
 *
 * Exposes observable slices of query state so consumers can compose their own
 * hooks.
 *
 * Enables fine-grained reactivity: combining a `$` hook with a single helper
 * subscribes only to that slice.
 */
const useQueryCore = <TData, TKey = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}: QueryHookOptions<TData, TKey>): InternalHookApi<TData>['_'] => {
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

  const fetchFn = useCallback(
    (args: unknown, declarative: boolean) => {
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

      const [cacheEntryImmutable, cacheEntryMutable] = cacheEntry;

      if (
        declarative &&
        (cacheEntryImmutable.f.get() || Date.now() - staleTime < cacheEntryMutable.t!)
      ) {
        // No return value needed since this is only called inside this query hook when declarative
        return;
      }

      return fetchCacheEntry(queryMeta, cacheEntry);
    },

    // `queryKey` and `queryFn` can be safely omitted from the dependency array
    // because they are correlated with `strQueryKey`.
    // `queryCacheEntry` and other values like `createDefaultCacheEntry` are constants
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [strQueryKey, cacheMode, staleTime]
  );

  useEffect(() => {
    if (enabled) fetchFn(UNDEFINED, true);
  }, [enabled, fetchFn]);

  return {
    s: useSnapshot(queryCacheEntry)[0],
    $: queryCacheEntry,
    f: fetchFn
  };
};

export { useQueryCore };
