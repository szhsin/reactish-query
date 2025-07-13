import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { queryCache } from './queryCache.mjs';

const defaultQueryState = {
  isLoading: false
};
const useQuery = (key, {
  fetcher,
  cacheMode,
  enabled = true
} = {}) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(state(defaultQueryState));
  const refetch = useCallback(async (params, fetchIfNoCache) => {
    let queryAtom;
    if (cacheMode !== 'off') {
      const queryKey = params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
      queryAtom = queryCache.get(queryKey);
      if (!queryAtom) {
        queryAtom = state(defaultQueryState);
        queryCache.set(queryKey, queryAtom);
      }
    } else {
      queryAtom = state(defaultQueryState);
    }
    setQueryAtomForRender(queryAtom);
    const {
      get: getQueryState,
      set: setQueryState
    } = queryAtom;
    let result = getQueryState();
    if (fetchIfNoCache && result.data !== undefined || !fetcher || result.isLoading) return Promise.resolve(result);
    setQueryState(prev => ({
      ...prev,
      isLoading: true
    }));
    try {
      result = {
        data: await fetcher(key, params),
        isLoading: false
      };
    } catch (error) {
      result = {
        error: error,
        isLoading: false
      };
    }
    setQueryState(result);
    return result;
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [stringKey, cacheMode]);
  useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);
  return {
    ...useSnapshot(queryAtomForRender),
    refetch: refetch
  };
};

export { useQuery };
