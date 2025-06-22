'use strict';

var react = require('react');
var reactishState = require('reactish-state');

const defaultQueryState = {
  isLoading: false
};
const queryMap = new Map();

/* eslint-disable react-hooks/exhaustive-deps */

const useQuery = (key, {
  fetcher
} = {}) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = react.useState(reactishState.state(defaultQueryState));
  const refetch = react.useCallback(() => {
    const queryAtom = queryMap.get(stringKey);
    if (!queryAtom) return Promise.resolve(defaultQueryState);
    const {
      get: getQueryState,
      set: setQueryState
    } = queryAtom;
    let result = getQueryState();
    if (!fetcher || result.isLoading) return Promise.resolve(result);
    setQueryState(prev => ({
      ...prev,
      isLoading: true
    }));
    return fetcher(key).then(data => {
      result = {
        data,
        isLoading: false
      };
      setQueryState(result);
      return result;
    }).catch(error => {
      result = {
        error: error,
        isLoading: false
      };
      setQueryState(result);
      return result;
    });
  }, [stringKey]);
  react.useEffect(() => {
    let queryAtom = queryMap.get(stringKey);
    if (!queryAtom) {
      queryAtom = reactishState.state(defaultQueryState);
      queryMap.set(stringKey, queryAtom);
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
