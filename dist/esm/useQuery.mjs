import { useState, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';

const defaultQueryResult = {
  isLoading: false
};
const queryMap = new Map();
const useQuery = (key, {
  fetcher
} = {}) => {
  const [queryState, setQueryState] = useState(state(defaultQueryResult));
  const stringKey = JSON.stringify(key);
  useEffect(() => {
    let queryState = queryMap.get(stringKey);
    if (!queryState) {
      queryState = state(defaultQueryResult);
      queryMap.set(stringKey, queryState);
    }
    setQueryState(queryState);
    const {
      isLoading,
      data
    } = queryState.get();
    const {
      set: setQueryResult
    } = queryState;
    if (fetcher && !isLoading && data === undefined) {
      setQueryResult(prev => ({
        ...prev,
        isLoading: true
      }));
      fetcher(key).then(data => setQueryResult({
        data,
        isLoading: false
      })).catch(error => setQueryResult({
        error: error,
        isLoading: false
      }));
    }
  }, [stringKey]);
  return useSnapshot(queryState);
};

export { useQuery };
