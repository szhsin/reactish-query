import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { queryCache } from './queryCache.mjs';

const defaultQueryState = {
  isFetching: false
};
const useQuery = ({
  key,
  fetcher,
  cacheMode,
  enabled = true
}) => {
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
    if (fetchIfNoCache && result.data !== undefined || !fetcher || result.isFetching) return Promise.resolve(result);
    setQueryState(prev => ({
      ...prev,
      isFetching: true
    }));
    try {
      result = {
        data: await fetcher({
          key,
          params
        }),
        isFetching: false
      };
    } catch (error) {
      result = {
        error: error,
        isFetching: false
      };
    }
    setQueryState(result);
    return result;
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [stringKey, cacheMode]);
  useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);
  const queryState = useSnapshot(queryAtomForRender);
  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  };
};

export { useQuery };
