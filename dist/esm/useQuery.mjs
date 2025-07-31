import { useState, useCallback, useEffect } from 'react';
import { state, useSnapshot } from 'reactish-state';
import { queryCache } from './queryCache.mjs';

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
  useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);
  const [queryState] = useSnapshot(queryAtomForRender);
  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  };
};

export { useQuery };
