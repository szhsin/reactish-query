import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { useQueryClient } from './useQueryClient.mjs';

const getDefaultQueryCacheEntry = stateBuilder => [stateBuilder({
  isFetching: false
}), {
  i: 0
}];
const useQuery = ({
  key,
  fetcher,
  cacheMode,
  enabled = true,
  staleTime = 0
}) => {
  const {
    getCache,
    getState
  } = useQueryClient();
  const queryCache = getCache();
  const state$1 = getState();
  const stringKey = JSON.stringify(key);
  const [queryCacheEntry, setQueryCacheEntry] = useState(() => getDefaultQueryCacheEntry(state));
  const refetch = useCallback(async (params, declarative) => {
    let cacheEntry;
    if (cacheMode !== 'off') {
      const queryKey = params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
      cacheEntry = queryCache.get(queryKey);
      if (!cacheEntry) {
        cacheEntry = getDefaultQueryCacheEntry(state$1);
        queryCache.set(queryKey, cacheEntry);
      }
    } else {
      cacheEntry = getDefaultQueryCacheEntry(state$1);
    }
    setQueryCacheEntry(cacheEntry);
    const [{
      get: getQueryCache,
      set: setQueryCache
    }, cacheMeta] = cacheEntry;
    let result = getQueryCache();
    if (!fetcher || declarative && (result.isFetching || Date.now() - staleTime < cacheMeta.t)) {
      return Promise.resolve(result);
    }
    const queryMeta = {
      key,
      params
    };
    setQueryCache({
      ...result,
      isFetching: true
    }, queryMeta);
    const requestSeq = ++cacheMeta.i;
    try {
      result = {
        data: await fetcher(queryMeta),
        isFetching: false
      };
      cacheMeta.t = Date.now();
    } catch (error) {
      result = {
        error: error,
        isFetching: false
      };
    }
    if (requestSeq === cacheMeta.i) setQueryCache(result, queryMeta);
    return result;
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [stringKey, cacheMode, staleTime]);
  useEffect(() => {
    if (enabled) refetch(undefined, true);
  }, [enabled, refetch]);
  const queryState = useSnapshot(queryCacheEntry[0]);
  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  };
};

export { useQuery };
