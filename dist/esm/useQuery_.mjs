import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { stringify, UNDEFINED } from './utils.mjs';
import { useQueryContext } from './useQueryContext.mjs';

const createInitialState = (state, meta, stateKey, initialValue) => state(initialValue, UNDEFINED, {
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
  const strQueryKey = stringify(queryKey) || '';
  const [queryCacheEntry] = useState(() => state(getDefaultQueryCacheEntry(state$1, {
    queryKey
  })));
  const refetch = useCallback(async (args, declarative) => {
    const cacheKey = args !== UNDEFINED ? `${strQueryKey}|${stringify(args)}` : strQueryKey;
    const queryStateMeta = {
      queryKey,
      args
    };
    let cacheEntry;
    if (cacheMode !== 'off') {
      const shouldPersist = cacheMode === 'persist';
      cacheEntry = queryCache.get(cacheKey, shouldPersist);
      if (!cacheEntry) {
        cacheEntry = getDefaultQueryCacheEntry(state$1, queryStateMeta);
        queryCache.set(cacheKey, cacheEntry, shouldPersist);
      }
    } else {
      cacheEntry = getDefaultQueryCacheEntry(state$1, queryStateMeta);
    }
    queryCacheEntry.set(cacheEntry);
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
        setError(UNDEFINED);
        cacheMeta.t = Date.now();
      }
    }
    return {
      data,
      error
    };
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [strQueryKey, cacheMode, staleTime]);
  useEffect(() => {
    if (enabled) refetch(UNDEFINED, true);
  }, [enabled, refetch]);
  return {
    /** @internal [INTERNAL ONLY – DO NOT USE] Observable query state */
    _: useSnapshot(queryCacheEntry)[0],
    refetch: refetch
  };
};

export { useQuery$ };
