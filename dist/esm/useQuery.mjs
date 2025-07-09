import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';

const defaultQueryState = {
  isLoading: false
};
const queryMap = new Map();
const clearQueryCache = () => queryMap.clear();

/* eslint-disable react-hooks/exhaustive-deps */

const useQuery = (key, {
  fetcher
} = {}) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(state(defaultQueryState));
  const refetch = useCallback(async () => {
    const {
      get: getQueryState,
      set: setQueryState
    } = queryMap.get(stringKey);
    let result = getQueryState();
    if (!fetcher || result.isLoading) return Promise.resolve(result);
    setQueryState(prev => ({
      ...prev,
      isLoading: true
    }));
    try {
      result = {
        data: await fetcher(key),
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
  }, [stringKey]);
  useEffect(() => {
    let queryAtom = queryMap.get(stringKey);
    if (!queryAtom) {
      queryAtom = state(defaultQueryState);
      queryMap.set(stringKey, queryAtom);
    }
    setQueryAtomForRender(queryAtom);
    if (queryAtom.get().data === undefined) refetch();
  }, [refetch]);
  return {
    ...useSnapshot(queryAtomForRender),
    refetch
  };
};

export { clearQueryCache, useQuery };
