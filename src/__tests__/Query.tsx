import { type ReactNode, useState } from 'react';
import type { QueryState, QueryHookOptions } from '../types';
import { useQuery } from '../index';
import { fakeRequest } from './fakeRequest';

const Query = ({
  queryName,
  defaultId = 1,
  noFetcher,
  children,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  noFetcher?: boolean;
  children?: ReactNode;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'enabled'>) => {
  const [id, setId] = useState(defaultId);
  const [refetchResult, setRefetchResult] = useState<QueryState<{ result: number }>>();
  const { isLoading, error, data, refetch } = useQuery({
    ...queryOptions,
    key: { requestId: id },
    ...(!noFetcher && {
      // testing fetcher use both local and variables from the query key
      fetcher: (arg: { key: { requestId: number } }) =>
        fakeRequest((arg.key.requestId + id) / 2)
    })
  });

  return (
    <section>
      <div data-testid={`query-${queryName}`}>Query {queryName}</div>
      <div data-testid={`loading-${queryName}`}>{isLoading ? 'Loading' : 'Loaded'}</div>
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
          setRefetchResult(result);
        }}
      >
        Refetch
      </button>
      {children}
    </section>
  );
};

const Queries = () => (
  <Query queryName="1" defaultId={1}>
    <Query queryName="2" defaultId={2} />
    <Query queryName="3" defaultId={1}>
      <Query queryName="4" defaultId={2} noFetcher />
    </Query>
  </Query>
);

export { Query, Queries };
