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
      _: [createDefaultCacheEntry, resovleCacheEntry]
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
  const refetch = useCallback(async (args, declarative) => {
    const queryMeta = {
      queryKey,
      args
    };
    const cacheEntry = cacheMode !== 'off' ? resovleCacheEntry(queryMeta, queryFn, cacheMode === 'persist', strQueryKey) : createDefaultCacheEntry(queryMeta, queryFn);
    queryCacheEntry.set(cacheEntry);
    const [queryState, cacheMeta] = cacheEntry;
    if (declarative && (queryState.f.get() || Date.now() - staleTime < cacheMeta.t)) {
      // No return value needed since this is only called inside this query hook when declarative
      return;
    }
    return fetchCacheEntry(queryMeta, cacheEntry);
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [strQueryKey, cacheMode, staleTime]);
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
  };
};

export { useQuery$ };
