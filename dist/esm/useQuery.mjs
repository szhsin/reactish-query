import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { queryCache } from './queryCache.mjs';

const defaultQueryState = {
  isLoading: false
};

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
    } = queryCache.get(stringKey);
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
    let queryAtom = queryCache.get(stringKey);
    if (!queryAtom) {
      queryAtom = state(defaultQueryState);
      queryCache.set(stringKey, queryAtom);
    }
    setQueryAtomForRender(queryAtom);
    if (queryAtom.get().data === undefined) refetch();
  }, [refetch]);
  return {
    ...useSnapshot(queryAtomForRender),
    refetch
  };
};

export { useQuery };
