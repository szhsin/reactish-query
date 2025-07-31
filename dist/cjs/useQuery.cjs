'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var queryCache = require('./queryCache.cjs');

const defaultQueryState = [{
  isFetching: false
}, {}];
const useQuery = ({
  key,
  fetcher,
  cacheMode,
  enabled = true
}) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = react.useState(reactishState.state(defaultQueryState));
  const refetch = react.useCallback(async (params, fetchIfNoCache) => {
    let queryAtom;
    if (cacheMode !== 'off') {
      const queryKey = params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
      queryAtom = queryCache.queryCache.get(queryKey);
      if (!queryAtom) {
        queryAtom = reactishState.state(defaultQueryState);
        queryCache.queryCache.set(queryKey, queryAtom);
      }
    } else {
      queryAtom = reactishState.state(defaultQueryState);
    }
    setQueryAtomForRender(queryAtom);
    const {
      get: getQueryCache,
      set: setQueryCache
    } = queryAtom;
    let [result] = getQueryCache();
    if (fetchIfNoCache && result.data !== undefined || !fetcher || result.isFetching) return Promise.resolve(result);
    const meta = {
      key,
      params
    };
    setQueryCache([{
      ...result,
      isFetching: true
    }, meta]);
    try {
      result = {
        data: await fetcher(meta),
        isFetching: false
      };
    } catch (error) {
      result = {
        error: error,
        isFetching: false
      };
    }
    setQueryCache([result, meta]);
    return result;
  }, /* eslint-disable-next-line react-hooks/exhaustive-deps */
  [stringKey, cacheMode]);
  react.useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);
  const [queryState] = reactishState.useSnapshot(queryAtomForRender);
  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  };
};

exports.useQuery = useQuery;
