'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var useQueryClient = require('./useQueryClient.cjs');

const getDefaultQueryCacheEntry = stateBuilder => [stateBuilder({
  isFetching: false
}), {
  i: 0
}];
const useQuery = ({
  queryKey,
  queryFn,
  cacheMode,
  enabled = true,
  staleTime = 0
}) => {
  const {
    getCache,
    getState
  } = useQueryClient.useQueryClient();
  const queryCache = getCache();
  const state = getState();
  const stringKey = JSON.stringify(queryKey);
  const [queryCacheEntry, setQueryCacheEntry] = react.useState(() => getDefaultQueryCacheEntry(reactishState.state));
  const refetch = react.useCallback(async (args, declarative) => {
    let cacheEntry;
    if (cacheMode !== 'off') {
      const shouldPersist = cacheMode === 'persist';
      const key = args !== undefined ? `${stringKey}|${JSON.stringify(args)}` : stringKey;
      cacheEntry = queryCache.get(key, shouldPersist);
      if (!cacheEntry) {
        cacheEntry = getDefaultQueryCacheEntry(state);
        queryCache.set(key, cacheEntry, shouldPersist);
      }
    } else {
      cacheEntry = getDefaultQueryCacheEntry(state);
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
  react.useEffect(() => {
    if (enabled) refetch(undefined, true);
  }, [enabled, refetch]);
  const queryState = reactishState.useSnapshot(queryCacheEntry[0]);
  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  };
};

exports.useQuery = useQuery;
