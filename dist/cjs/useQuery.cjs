'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var queryCache = require('./queryCache.cjs');

const defaultQueryState = {
  isLoading: false
};

/* eslint-disable react-hooks/exhaustive-deps */

const useQuery = (key, {
  fetcher
} = {}) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = react.useState(reactishState.state(defaultQueryState));
  const refetch = react.useCallback(async () => {
    const {
      get: getQueryState,
      set: setQueryState
    } = queryCache.queryCache.get(stringKey);
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
  react.useEffect(() => {
    let queryAtom = queryCache.queryCache.get(stringKey);
    if (!queryAtom) {
      queryAtom = reactishState.state(defaultQueryState);
      queryCache.queryCache.set(stringKey, queryAtom);
    }
    setQueryAtomForRender(queryAtom);
    if (queryAtom.get().data === undefined) refetch();
  }, [refetch]);
  return {
    ...reactishState.useSnapshot(queryAtomForRender),
    refetch
  };
};

exports.useQuery = useQuery;
