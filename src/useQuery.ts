import { useState, useEffect } from 'react';
import { state, useSnapshot, type State } from 'reactish-state';

export type Fetcher<TData, TKey = unknown> = (key: TKey) => Promise<TData>;

export type QueryHookOptions<TData, TKey = unknown> = {
  fetcher?: Fetcher<TData, TKey>;
};

export type QueryHookResult<TData> = {
  isLoading: boolean;
  data?: TData;
  error?: Error;
};

type QueryState<TData> = State<QueryHookResult<TData>, unknown>;

const defaultQueryResult = { isLoading: false };
const queryMap = new Map<string, unknown>();

const useQuery = <TData, TKey = unknown>(
  key: TKey,
  { fetcher }: QueryHookOptions<TData, TKey> = {}
) => {
  const [queryState, setQueryState] = useState(
    state<QueryHookResult<TData>, unknown>(defaultQueryResult)
  );
  const stringKey = JSON.stringify(key);

  useEffect(() => {
    let queryState = queryMap.get(stringKey) as QueryState<TData>;
    if (!queryState) {
      queryState = state<QueryHookResult<TData>, unknown>(defaultQueryResult);
      queryMap.set(stringKey, queryState);
    }
    setQueryState(queryState);
    const { isLoading, data } = queryState.get();
    const { set: setQueryResult } = queryState;
    if (fetcher && !isLoading && data === undefined) {
      setQueryResult((prev) => ({ ...prev, isLoading: true }));
      fetcher(key)
        .then((data) => setQueryResult({ data, isLoading: false }))
        .catch((error) => setQueryResult({ error: error as Error, isLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringKey]);

  return useSnapshot(queryState);
};

export { useQuery };
