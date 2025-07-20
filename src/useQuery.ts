import { useState, useEffect, useCallback } from 'react';
import { state, useSnapshot, type State } from 'reactish-state';
import type { QueryHookOptions, QueryState, LazyFetcher, QueryHookResult } from './types';
import { queryCache } from './queryCache';

type QueryAtom<TData> = State<QueryState<TData>, unknown>;

const defaultQueryState = { isFetching: false };

const useQuery = <TData, TKey = unknown>({
  key,
  fetcher,
  cacheMode,
  enabled = true
}: QueryHookOptions<TData, TKey>) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(
    state<QueryState<TData>, unknown>(defaultQueryState)
  );

  const refetch = useCallback(
    async (params: unknown, fetchIfNoCache: boolean): Promise<QueryState<TData>> => {
      let queryAtom: QueryAtom<TData>;
      if (cacheMode !== 'off') {
        const queryKey =
          params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
        queryAtom = queryCache.get(queryKey) as QueryAtom<TData>;
        if (!queryAtom) {
          queryAtom = state<QueryState<TData>, unknown>(defaultQueryState);
          queryCache.set(queryKey, queryAtom);
        }
      } else {
        queryAtom = state<QueryState<TData>, unknown>(defaultQueryState);
      }
      setQueryAtomForRender(queryAtom);

      const { get: getQueryState, set: setQueryState } = queryAtom;
      let result = getQueryState();
      if ((fetchIfNoCache && result.data !== undefined) || !fetcher || result.isFetching)
        return Promise.resolve(result);

      setQueryState((prev) => ({ ...prev, isFetching: true }));
      try {
        result = {
          data: await (fetcher as LazyFetcher<TData, TKey, unknown>)({ key, params }),
          isFetching: false
        };
      } catch (error) {
        result = { error: error as Error, isFetching: false };
      }
      setQueryState(result);
      return result;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringKey, cacheMode]
  );

  useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);

  const queryState = useSnapshot(queryAtomForRender);

  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  } as QueryHookResult<TData>;
};

export { useQuery };
