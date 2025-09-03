import { type ReactNode, useState } from 'react';
import type { QueryHookOptions, QueryObserverOptions } from '../index';
import { useQuery } from '../index';
import { useQueryObserver } from '../composable';
import { fakeRequest } from './fakeRequest';

const useQueryWithObserver = <TData, TKey = unknown>({
  onData,
  onError,
  ...options
}: QueryHookOptions<TData, TKey> & QueryObserverOptions<TData>) =>
  useQueryObserver(useQuery(options), { onData, onError });

const QueryObserver = ({
  queryName,
  defaultId = 1,
  noFetcher,
  children,
  onData,
  onError,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  noFetcher?: boolean;
  children?: ReactNode;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'enabled' | 'staleTime'> & {
    onData?: (args: { data: number; id: number; query: string }) => void;
    onError?: (args: { error: string; id: number; query: string }) => void;
  }) => {
  const [id, setId] = useState(defaultId);
  const { isFetching, error, data, refetch } = useQueryWithObserver({
    ...queryOptions,
    queryKey: { requestId: id },
    ...(!noFetcher && {
      // testing fetcher use both local and variables from the query key
      queryFn: (arg: { queryKey: { requestId: number } }) =>
        fakeRequest((arg.queryKey.requestId + id) / 2)
    }),
    onData: (data) => onData?.({ data, id, query: queryName }),
    onError: (error) => onError?.({ error: error.message, id, query: queryName })
  });

  return (
    <section>
      <div data-testid={`query-${queryName}`}>Query {queryName}</div>
      <div data-testid={`status-${queryName}`}>{isFetching ? 'fetching' : 'idle'}</div>
      <div data-testid={`error-${queryName}`}>{error?.message}</div>
      <div data-testid={`data-${queryName}`}>{data}</div>
      <button data-testid={`plus-${queryName}`} onClick={() => setId((s) => s + 1)}>
        Plus
      </button>
      <button data-testid={`minus-${queryName}`} onClick={() => setId((s) => s - 1)}>
        Minus
      </button>
      <button data-testid={`refetch-${queryName}`} onClick={() => refetch()}>
        Refetch
      </button>
      {children}
    </section>
  );
};

export { QueryObserver };
