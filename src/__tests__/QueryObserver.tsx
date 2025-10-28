import { type ReactNode, useState } from 'react';
import type {
  QueryObserverOptions,
  QueryHookOptions,
  LazyQueryHookOptions,
  MutationHookOptions,
  ObserverMeta
} from '../index';
import { useQuery, useLazyQuery$, useMutation } from '../index';
import { useQueryObserver } from '../composable';
import { fakeRequest } from './fakeRequest';

export const useQueryWithObserver = <TData, TKey = unknown>({
  onData,
  onError,
  ...options
}: QueryHookOptions<TData, TKey> & QueryObserverOptions<TData, TKey>) =>
  useQueryObserver(useQuery(options), { onData, onError });

export const useLazyQueryWithObserver$ = <TData, TArgs, TKey = unknown>({
  onData,
  onError,
  ...options
}: LazyQueryHookOptions<TData, TArgs, TKey> & QueryObserverOptions<TData, TKey, TArgs>) =>
  useQueryObserver(useLazyQuery$(options), { onData, onError });

export const useMutationWithObserver = <TData, TArgs, TKey = unknown>({
  onData,
  onError,
  ...options
}: MutationHookOptions<TData, TArgs, TKey> & QueryObserverOptions<TData, TKey, TArgs>) =>
  useQueryObserver(useMutation(options), { onData, onError });

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
    onData?: (
      args: { data: number; id: number; query: string },
      metadata: ObserverMeta<{ requestId: number }>
    ) => void;
    onError?: (
      args: { error: string; id: number; query: string },
      metadata: ObserverMeta<{ requestId: number }>
    ) => void;
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
    onData: (data, metadata) => onData?.({ data, id, query: queryName }, metadata),
    onError: (error, metadata) =>
      onError?.({ error: error.message, id, query: queryName }, metadata)
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
      <button data-testid={`refetch-${queryName}`} onClick={refetch}>
        Refetch
      </button>
      {children}
    </section>
  );
};

const MutationObserver = ({
  queryName,
  defaultId = 1,
  children,
  onData,
  onError
}: {
  queryName: string;
  defaultId?: number;
  children?: ReactNode;
} & {
  onData?: (
    args: { data: number; id: number; query: string },
    metadata: ObserverMeta<{ keyId: number }, { paramId: number }>
  ) => void;
  onError?: (
    args: { error: string; id: number; query: string },
    metadata: ObserverMeta<{ keyId: number }, { paramId: number }>
  ) => void;
}) => {
  const [id, setId] = useState(defaultId);
  const { isFetching, error, data, args, trigger } = useMutationWithObserver<
    number,
    { paramId: number },
    { keyId: number }
  >({
    queryKey: { keyId: id },
    // testing queryFn use both local and variables from the arguments
    queryFn: ({ queryKey, args }) =>
      fakeRequest((id + queryKey!.keyId + args.paramId) / 3),
    onData: (data, metadata) => onData?.({ data, id, query: queryName }, metadata),
    onError: (error, metadata) =>
      onError?.({ error: error.message, id, query: queryName }, metadata)
  });

  return (
    <section>
      <div data-testid={`query-${queryName}`}>Query {queryName}</div>
      <div data-testid={`status-${queryName}`}>{isFetching ? 'fetching' : 'idle'}</div>
      <div data-testid={`error-${queryName}`}>{error?.message}</div>
      <div data-testid={`data-${queryName}`}>{data}</div>
      <div data-testid={`args-${queryName}`}>{args?.paramId}</div>
      <button data-testid={`plus-${queryName}`} onClick={() => setId((s) => s + 1)}>
        Plus
      </button>
      <button data-testid={`minus-${queryName}`} onClick={() => setId((s) => s - 1)}>
        Minus
      </button>
      <button
        data-testid={`trigger-${queryName}`}
        onClick={() => trigger({ paramId: id })}
      >
        Trigger
      </button>
      {children}
    </section>
  );
};

export { QueryObserver, MutationObserver };
