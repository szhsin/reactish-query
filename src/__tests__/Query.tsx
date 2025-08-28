import { type ReactNode, useState } from 'react';
import type { FetchResult, QueryHookOptions } from '../types';
import { useQuery, QueryProvider } from '../index';
import { fakeRequest } from './fakeRequest';

const Query = ({
  queryName,
  defaultId = 1,
  noFetcher,
  noRefetchResult,
  children,
  render,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  noFetcher?: boolean;
  noRefetchResult?: boolean;
  children?: ReactNode;
  render?: (queryName: string, id: number) => void;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'enabled' | 'staleTime'>) => {
  const [id, setId] = useState(defaultId);
  const [refetchResult, setRefetchResult] = useState<FetchResult<{ result: number }>>();
  const { isPending, isFetching, error, data, refetch } = useQuery({
    ...queryOptions,
    queryKey: { requestId: id },
    ...(!noFetcher && {
      // testing fetcher use both local and variables from the query key
      queryFn: (arg: { queryKey: { requestId: number } }) =>
        fakeRequest({ result: (arg.queryKey.requestId + id) / 2 })
    })
  });

  render?.(queryName, id);

  if (isPending) {
    if (data !== undefined || error)
      throw new Error('Data and error should not have value when pending');
  } else {
    if (data === undefined && !error)
      throw new Error('Data or error should have value when not pending');
  }

  return (
    <section>
      <div data-testid={`query-${queryName}`}>Query {queryName}</div>
      <div data-testid={`status-${queryName}`}>{isFetching ? 'fetching' : 'idle'}</div>
      <div data-testid={`error-${queryName}`}>{error?.message}</div>
      <div data-testid={`data-${queryName}`}>{data?.result}</div>
      <div data-testid={`refetch-data-${queryName}`}>{refetchResult?.data?.result}</div>
      <div data-testid={`refetch-error-${queryName}`}>
        {refetchResult?.error?.message}
      </div>
      <button data-testid={`plus-${queryName}`} onClick={() => setId((s) => s + 1)}>
        Plus
      </button>
      <button data-testid={`minus-${queryName}`} onClick={() => setId((s) => s - 1)}>
        Minus
      </button>
      <button
        data-testid={`refetch-${queryName}`}
        onClick={async () => {
          const result = await refetch();
          !noRefetchResult && setRefetchResult(result);
        }}
      >
        Refetch
      </button>
      {children}
    </section>
  );
};

const Queries = ({ staleTime = Infinity }: { staleTime?: number }) => (
  <QueryProvider defaultOptions={{ staleTime }}>
    <Query queryName="a" defaultId={1}>
      <Query queryName="b" defaultId={2} />
      <Query queryName="c" defaultId={1}>
        <Query queryName="d" defaultId={2} noFetcher />
      </Query>
    </Query>
  </QueryProvider>
);

export { Query, Queries };
