import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { stringify, UNDEFINED } from './utils.mjs';
import { fetchCacheEntry } from './queryCacheUtils.mjs';
import { useQueryContext } from './useQueryContext.mjs';

const useQuery$ = ({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}) => {
  const {
    client: {
      _: [createDefaultCacheEntry, resolveCacheEntry]
    },
    defaultOptions
  } = useQueryContext();
  const {
    cacheMode,
    staleTime = 0
  } = {
    ...defaultOptions,
    ...options
  };
  const strQueryKey = stringify(queryKey);
  const [queryCacheEntry] = useState(() => state(createDefaultCacheEntry()));
  const refetch = useCallback((args, declarative) => {
    const queryMeta = {
      queryKey,
      args
    };
    const cacheEntry = cacheMode !== 'off' ? resolveCacheEntry(queryMeta, queryFn, cacheMode === 'persist', strQueryKey) : createDefaultCacheEntry(queryMeta, queryFn);
    queryCacheEntry.set(cacheEntry);
    const [cacheEntryImmutable, cacheEntryMutable] = cacheEntry;
    if (declarative && (cacheEntryImmutable.f.get() || Date.now() - staleTime < cacheEntryMutable.t)) {
      return;
    }
    return fetchCacheEntry(queryMeta, cacheEntry);
  }, [strQueryKey, cacheMode, staleTime]);
  useEffect(() => {
    if (enabled) refetch(UNDEFINED, true);
  }, [enabled, refetch]);
  return {
    refetch,
    _: {
      s: useSnapshot(queryCacheEntry)[0],
      $: queryCacheEntry
    }
  };
};

export { useQuery$ };
