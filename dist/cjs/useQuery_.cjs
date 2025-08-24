'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var utils = require('./utils.cjs');
var useQueryContext = require('./useQueryContext.cjs');

const getMiddlewareMeta = (stateKey, queryStateMeta) => ({
  ...queryStateMeta,
  stateKey
});
const getDefaultQueryCacheEntry = (state, meta) => [{
  d: state(utils.UNDEFINED, utils.UNDEFINED, getMiddlewareMeta('data', meta)),
  e: state(utils.UNDEFINED, utils.UNDEFINED, getMiddlewareMeta('error', meta)),
  p: state(false, utils.UNDEFINED, getMiddlewareMeta('isFetching', meta))
}, {
  i: 0
}];
const useQuery$ = ({
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
  } = useQueryContext.useQueryContext();
  const {
    cacheMode,
    staleTime = 0
  } = {
    ...defaultOptions,
    ...options
  };
  const queryCache = getCache();
  const state = getState();
  const stringKey = utils.stringify(queryKey) || '';
  const [queryCacheEntry, setQueryCacheEntry] = react.useState(() => getDefaultQueryCacheEntry(reactishState.state));
  const refetch = react.useCallback(async (args, declarative) => {
    let cacheEntry;
    const strKey = args !== utils.UNDEFINED ? `${stringKey}|${utils.stringify(args)}` : stringKey;
    const queryStateMeta = {
      strKey,
      queryKey,
      args
    };
    if (cacheMode !== 'off') {
      const shouldPersist = cacheMode === 'persist';
      cacheEntry = queryCache.get(strKey, shouldPersist);
      if (!cacheEntry) {
        cacheEntry = getDefaultQueryCacheEntry(state, queryStateMeta);
        queryCache.set(strKey, cacheEntry, shouldPersist);
      }
    } else {
      cacheEntry = getDefaultQueryCacheEntry(state, queryStateMeta);
    }
    setQueryCacheEntry(cacheEntry);
    const [{
      d: data$,
      e: {
        set: setError
      },
      p: {
        set: setIsFetching,
        get: getIsFetching
      }
    }, cacheMeta] = cacheEntry;
    if (!queryFn || declarative && (getIsFetching() || Date.now() - staleTime < cacheMeta.t)) {
      return Promise.resolve({});
    }
    setIsFetching(true);
    const requestSeq = ++cacheMeta.i;
    let data, error;
    try {
      data = await queryFn(queryStateMeta);
      cacheMeta.t = Date.now();
    } catch (err) {
      error = err;
    }
    if (requestSeq === cacheMeta.i) {
      setIsFetching(false);
      if (error) {
        setError(error);
      } else {
        data$.set(data);
        setError(utils.UNDEFINED);
        cacheMeta.t = Date.now();
      }
    }
    return {
      data,
      error
    };
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [stringKey, cacheMode, staleTime]);
  react.useEffect(() => {
    if (enabled) refetch(utils.UNDEFINED, true);
  }, [enabled, refetch]);
  return {
    /** @internal Observable query state */
    _: queryCacheEntry[0],
    refetch
  };
};

exports.useQuery$ = useQuery$;
