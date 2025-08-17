import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { useQueryContext } from './useQueryContext.mjs';
import { stringify } from './utils.mjs';

const getDefaultQueryCacheEntry = stateBuilder => [stateBuilder({
  isFetching: false
}), {
  i: 0
}];
const useQuery = ({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}) => {
  const {
    client: {
      getCache,
      getState
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
  const queryCache = getCache();
  const state$1 = getState();
  const stringKey = stringify(queryKey);
  const [queryCacheEntry, setQueryCacheEntry] = useState(() => getDefaultQueryCacheEntry(state));
  const refetch = useCallback(async (args, declarative) => {
    let cacheEntry;
    if (cacheMode !== 'off') {
      const shouldPersist = cacheMode === 'persist';
      const key = args !== undefined ? `${stringKey}|${stringify(args)}` : stringKey;
      cacheEntry = queryCache.get(key, shouldPersist);
      if (!cacheEntry) {
        cacheEntry = getDefaultQueryCacheEntry(state$1);
        queryCache.set(key, cacheEntry, shouldPersist);
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
    if (!queryFn || declarative && (result.isFetching || Date.now() - staleTime < cacheMeta.t)) {
      return Promise.resolve(result);
    }
    const queryMeta = {
      queryKey,
      args
    };
    setQueryCache({
      ...result,
      isFetching: true
    }, queryMeta);
    const requestSeq = ++cacheMeta.i;
    try {
      result = {
        data: await queryFn(queryMeta),
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
