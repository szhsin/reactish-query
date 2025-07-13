import { useState, useEffect, useCallback } from 'react';
import { state, useSnapshot, type State } from 'reactish-state';
import type { QueryHookOptions, QueryState, LazyFetcher, Refetch } from './types';
import { queryCache } from './queryCache';

type QueryAtom<TData> = State<QueryState<TData>, unknown>;

const defaultQueryState = { isLoading: false };

const useQuery = <TData, TKey = unknown>(
  key: TKey,
  { fetcher, enabled = true }: QueryHookOptions<TData, TKey> = {}
) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(
    state<QueryState<TData>, unknown>(defaultQueryState)
  );

  const refetch = useCallback(
    async (params: unknown, fetchIfNoCache: boolean): Promise<QueryState<TData>> => {
      const queryKey =
        params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
      let queryAtom = queryCache.get(queryKey) as QueryAtom<TData> | undefined;
      if (!queryAtom) {
        queryAtom = state<QueryState<TData>, unknown>(defaultQueryState);
        queryCache.set(queryKey, queryAtom);
      }
      setQueryAtomForRender(queryAtom);

      const { get: getQueryState, set: setQueryState } = queryAtom;
      let result = getQueryState();
      if ((fetchIfNoCache && result.data !== undefined) || !fetcher || result.isLoading)
        return Promise.resolve(result);

      setQueryState((prev) => ({ ...prev, isLoading: true }));
      try {
        result = {
          data: await (fetcher as LazyFetcher<TData, TKey, unknown>)(key, params),
          isLoading: false
        };
      } catch (error) {
        result = { error: error as Error, isLoading: false };
      }
      setQueryState(result);
      return result;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringKey]
  );

  useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);

  return { ...useSnapshot(queryAtomForRender), refetch: refetch as Refetch<TData> };
};

export { useQuery };
