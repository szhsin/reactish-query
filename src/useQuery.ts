import { useState, useEffect, useCallback } from 'react';
import { state as placeholderState, useSnapshot } from 'reactish-state';
import type { State, StateBuilder } from 'reactish-state';
import type { QueryState, QueryHookOptions, QueryHookResult, LazyFetcher } from './types';
import { useQueryClient } from './useQueryClient';

type QueryCacheEntry<TData> = readonly [State<QueryState<TData>>, { i: number }];

const getDefaultQueryCacheEntry = <TData>(
  stateBuilder: StateBuilder
): QueryCacheEntry<TData> => [
  stateBuilder<QueryState<TData>, unknown>({ isFetching: false }),
  { i: 0 }
];

const useQuery = <TData, TKey = unknown>({
  key,
  fetcher,
  cacheMode,
  enabled = true
}: QueryHookOptions<TData, TKey>) => {
  const { getCache, getState } = useQueryClient();
  const queryCache = getCache();
  const state = getState();
  const stringKey = JSON.stringify(key);
  const [queryCacheEntry, setQueryCacheEntry] = useState<QueryCacheEntry<TData>>(() =>
    getDefaultQueryCacheEntry(placeholderState)
  );

  const refetch = useCallback(
    async (params: unknown, declarative: boolean): Promise<QueryState<TData>> => {
      let cacheEntry: QueryCacheEntry<TData>;
      if (cacheMode !== 'off') {
        const queryKey =
          params !== undefined ? `${stringKey}|${JSON.stringify(params)}` : stringKey;
        cacheEntry = queryCache.get(queryKey) as QueryCacheEntry<TData>;
        if (!cacheEntry) {
          cacheEntry = getDefaultQueryCacheEntry(state);
          queryCache.set(queryKey, cacheEntry);
        }
      } else {
        cacheEntry = getDefaultQueryCacheEntry(state);
      }
      setQueryCacheEntry(cacheEntry);

      const [{ get: getQueryCache, set: setQueryCache }, cacheMeta] = cacheEntry;
      let result = getQueryCache();
      if (!fetcher || (declarative && (result.data !== undefined || result.isFetching))) {
        return Promise.resolve(result);
      }

      const queryMeta = { key, params };
      setQueryCache({ ...result, isFetching: true }, queryMeta);
      const requestSeq = ++cacheMeta.i;
      try {
        result = {
          data: await (fetcher as LazyFetcher<TData, TKey, unknown>)(queryMeta),
          isFetching: false
        };
      } catch (error) {
        result = { error: error as Error, isFetching: false };
      }
      if (requestSeq === cacheMeta.i) setQueryCache(result, queryMeta);
      return result;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringKey, cacheMode]
  );

  useEffect(() => {
    if (enabled) refetch(undefined, true);
  }, [enabled, refetch]);

  const queryState = useSnapshot(queryCacheEntry[0]);

  return {
    ...queryState,
    isPending: queryState.data === undefined && !queryState.error,
    refetch
  } as QueryHookResult<TData>;
};

export { useQuery };
