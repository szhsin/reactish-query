import { useState, useEffect, useCallback } from 'react';
import { state as placeholderState, useSnapshot } from 'reactish-state';
import type { State, StateBuilder } from 'reactish-state';
import type { QueryState, QueryHookOptions, QueryHookResult, LazyQueryFn } from './types';
import { useQueryClient } from './useQueryClient';

type QueryCacheEntry<TData> = readonly [
  State<QueryState<TData>>,
  {
    /** @internal Request sequence number */
    i: number;
    /** @internal Timestamp of the response */
    t?: number;
  }
];

const getDefaultQueryCacheEntry = <TData>(
  stateBuilder: StateBuilder
): QueryCacheEntry<TData> => [
  stateBuilder<QueryState<TData>, unknown>({ isFetching: false }),
  { i: 0 }
];

const useQuery = <TData, TKey = unknown>({
  queryKey,
  queryFn,
  cacheMode,
  enabled = true,
  staleTime = 0
}: QueryHookOptions<TData, TKey>) => {
  const { getCache, getState } = useQueryClient();
  const queryCache = getCache();
  const state = getState();
  const stringKey = JSON.stringify(queryKey);
  const [queryCacheEntry, setQueryCacheEntry] = useState<QueryCacheEntry<TData>>(() =>
    getDefaultQueryCacheEntry(placeholderState)
  );

  const refetch = useCallback(
    async (args: unknown, declarative: boolean): Promise<QueryState<TData>> => {
      let cacheEntry: QueryCacheEntry<TData>;
      if (cacheMode !== 'off') {
        const shouldPersist = cacheMode === 'persist';
        const key =
          args !== undefined ? `${stringKey}|${JSON.stringify(args)}` : stringKey;
        cacheEntry = queryCache.get(key, shouldPersist) as QueryCacheEntry<TData>;
        if (!cacheEntry) {
          cacheEntry = getDefaultQueryCacheEntry(state);
          queryCache.set(key, cacheEntry, shouldPersist);
        }
      } else {
        cacheEntry = getDefaultQueryCacheEntry(state);
      }
      setQueryCacheEntry(cacheEntry);

      const [{ get: getQueryCache, set: setQueryCache }, cacheMeta] = cacheEntry;
      let result = getQueryCache();

      if (
        !queryFn ||
        (declarative && (result.isFetching || Date.now() - staleTime < cacheMeta.t!))
      ) {
        return Promise.resolve(result);
      }

      const queryMeta = { queryKey, args };
      setQueryCache({ ...result, isFetching: true }, queryMeta);
      const requestSeq = ++cacheMeta.i;
      try {
        result = {
          data: await (queryFn as LazyQueryFn<TData, TKey, unknown>)(queryMeta),
          isFetching: false
        };
        cacheMeta.t = Date.now();
      } catch (error) {
        result = { error: error as Error, isFetching: false };
      }
      if (requestSeq === cacheMeta.i) setQueryCache(result, queryMeta);
      return result;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringKey, cacheMode, staleTime]
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
