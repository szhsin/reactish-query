import { useState, useEffect, useCallback } from 'react';
import { state, useSnapshot, type State } from 'reactish-state';
import type {
  QueryHookOptions,
  QueryState,
  QueryCache,
  LazyFetcher,
  QueryHookResult
} from './types';
import { queryCache } from './queryCache';

type QueryAtom<TData, TKey> = State<QueryCache<TData, TKey, unknown>>;

const defaultQueryState = [{ isFetching: false }, {}] as const;

const useQuery = <TData, TKey = unknown>({
  key,
  fetcher,
  cacheMode,
  enabled = true
}: QueryHookOptions<TData, TKey>) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(
    state<QueryCache<TData, TKey, unknown>, unknown>(defaultQueryState)
  );

  const refetch = useCallback(
    async (params: unknown, fetchIfNoCache: boolean): Promise<QueryState<TData>> => {
      let queryAtom: QueryAtom<TData, TKey>;
      if (cacheMode !== 'off') {
        const queryKey =
          params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
        queryAtom = queryCache.get(queryKey) as QueryAtom<TData, TKey>;
        if (!queryAtom) {
          queryAtom = state<QueryCache<TData, TKey, unknown>, unknown>(defaultQueryState);
          queryCache.set(queryKey, queryAtom);
        }
      } else {
        queryAtom = state<QueryCache<TData, TKey, unknown>, unknown>(defaultQueryState);
      }
      setQueryAtomForRender(queryAtom);

      const { get: getQueryCache, set: setQueryCache } = queryAtom;
      let [result] = getQueryCache();
      if ((fetchIfNoCache && result.data !== undefined) || !fetcher || result.isFetching)
        return Promise.resolve(result);

      const meta = { key, params };
      setQueryCache([{ ...result, isFetching: true }, meta]);
      try {
        result = {
          data: await (fetcher as LazyFetcher<TData, TKey, unknown>)(meta),
          isFetching: false
        };
      } catch (error) {
        result = { error: error as Error, isFetching: false };
      }
      setQueryCache([result, meta]);
      return result;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringKey, cacheMode]
  );

  useEffect(() => {
    enabled && refetch(undefined, true);
  }, [enabled, refetch]);

  const [queryState] = useSnapshot(queryAtomForRender);

  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  } as QueryHookResult<TData>;
};

export { useQuery };
