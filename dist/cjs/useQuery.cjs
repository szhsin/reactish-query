'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var queryCache = require('./queryCache.cjs');

const defaultQueryState = {
  isLoading: false
};
const useQuery = (key, {
  fetcher,
  enabled = true
} = {}) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = react.useState(reactishState.state(defaultQueryState));
  const refetch = react.useCallback(async (params, fetchIfNoCache) => {
    const queryKey = params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
    let queryAtom = queryCache.queryCache.get(queryKey);
    if (!queryAtom) {
      queryAtom = reactishState.state(defaultQueryState);
      queryCache.queryCache.set(queryKey, queryAtom);
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
  [stringKey]);
  react.useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);
  return {
    ...reactishState.useSnapshot(queryAtomForRender),
    refetch: refetch
  };
};

exports.useQuery = useQuery;
