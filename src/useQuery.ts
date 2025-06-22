import { useState, useEffect, useCallback } from 'react';
import { state, useSnapshot, type State } from 'reactish-state';

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
const queryMap = new Map<string, unknown>();

/* eslint-disable react-hooks/exhaustive-deps */

const useQuery = <TData, TKey = unknown>(
  key: TKey,
  { fetcher }: QueryHookOptions<TData, TKey> = {}
) => {
  const stringKey = JSON.stringify(key);
  const [queryAtomForRender, setQueryAtomForRender] = useState(
    state<QueryState<TData>, unknown>(defaultQueryState)
  );

  const refetch = useCallback((): Promise<QueryState<TData>> => {
    const queryAtom = queryMap.get(stringKey) as QueryAtom<TData> | undefined;
    if (!queryAtom) return Promise.resolve(defaultQueryState);

    const { get: getQueryState, set: setQueryState } = queryAtom;
    let result = getQueryState();
    if (!fetcher || result.isLoading) return Promise.resolve(result);

    setQueryState((prev) => ({ ...prev, isLoading: true }));
    return fetcher(key)
      .then((data) => {
        result = { data, isLoading: false };
        setQueryState(result);
        return result;
      })
      .catch((error) => {
        result = { error: error as Error, isLoading: false };
        setQueryState(result);
        return result;
      });
  }, [stringKey]);

  useEffect(() => {
    let queryAtom = queryMap.get(stringKey) as QueryAtom<TData> | undefined;
    if (!queryAtom) {
      queryAtom = state<QueryState<TData>, unknown>(defaultQueryState);
      queryMap.set(stringKey, queryAtom);
    }
    setQueryAtomForRender(queryAtom);
    if (queryAtom.get().data === undefined) refetch();
  }, [refetch]);

  return { ...useSnapshot(queryAtomForRender), refetch };
};

export { useQuery };
