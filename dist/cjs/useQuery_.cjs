'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var utils = require('./utils.cjs');
var useQueryContext = require('./useQueryContext.cjs');

const createInitialState = (state, meta, stateKey, initialValue) => state(initialValue, utils.UNDEFINED, {
  ...meta,
  stateKey
});
const getDefaultQueryCacheEntry = (state, meta) => [{
  d: createInitialState(state, meta, 'data'),
  e: createInitialState(state, meta, 'error'),
  f: createInitialState(state, meta, 'isFetching', false),
  p: createInitialState(state, meta, 'isPending', true)
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
      p: isPending$,
      e: {
        set: setError
      },
      f: {
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
    } catch (err) {
      error = err;
    }
    if (requestSeq === cacheMeta.i) {
      setIsFetching(false);
      if (error) {
        setError(error);
      } else {
        data$.set(data);
        isPending$.set(false);
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
    /** @internal [INTERNAL ONLY – DO NOT USE] Observable query state */
    _: queryCacheEntry[0],
    refetch: refetch
  };
};

exports.useQuery$ = useQuery$;
