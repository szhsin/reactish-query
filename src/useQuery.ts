import { useState, useEffect, useCallback } from 'react';
import { state, useSnapshot, type State } from 'reactish-state';
import { queryCache } from './queryCache';

export type Fetcher<TData, TKey = unknown> = (key: TKey) => Promise<TData>;

export type QueryHookOptions<TData, TKey = unknown> = {
  fetcher?: Fetcher<TData, TKey>;
};

export type QueryState<TData> = {
  isLoading: boolean;
  data?: TData;
  error?: Error;
};

type QueryAtom<TData> = State<QueryState<TData>, unknown>;

const defaultQueryState = { isLoading: false };

/* eslint-disable react-hooks/exhaustive-deps */

const useQuery = <TData, TKey = unknown>(
  key: TKey,
  { fetcher }: QueryHookOptions<TData, TKey> = {}
) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(
    state<QueryState<TData>, unknown>(defaultQueryState)
  );

  const refetch = useCallback(async (): Promise<QueryState<TData>> => {
    const { get: getQueryState, set: setQueryState } = queryCache.get(
      stringKey
    ) as QueryAtom<TData>;
    let result = getQueryState();
    if (!fetcher || result.isLoading) return Promise.resolve(result);

    setQueryState((prev) => ({ ...prev, isLoading: true }));
    try {
      result = { data: await fetcher(key), isLoading: false };
    } catch (error) {
      result = { error: error as Error, isLoading: false };
    }
    setQueryState(result);
    return result;
  }, [stringKey]);

  useEffect(() => {
    let queryAtom = queryCache.get(stringKey) as QueryAtom<TData> | undefined;
    if (!queryAtom) {
      queryAtom = state<QueryState<TData>, unknown>(defaultQueryState);
      queryCache.set(stringKey, queryAtom);
    }
    setQueryAtomForRender(queryAtom);
    if (queryAtom.get().data === undefined) refetch();
  }, [refetch]);

  return { ...useSnapshot(queryAtomForRender), refetch };
};

export { useQuery };
