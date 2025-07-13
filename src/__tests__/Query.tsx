import { type ReactNode, useState } from 'react';
import type { QueryState } from '../types';
import { useQuery } from '../useQuery';
import { fakeRequest } from './fakeRequest';

const Query = ({
  queryId,
  defaultId = 1,
  noFetcher,
  children
}: {
  queryId: number;
  defaultId?: number;
  noFetcher?: boolean;
  children?: ReactNode;
}) => {
  const [id, setId] = useState(defaultId);
  const [refetchResult, setRefetchResult] = useState<QueryState<{ result: number }>>();
  const { isLoading, error, data, refetch } = useQuery(
    { requestId: id },
    !noFetcher
      ? // ensure fetcher use both local and variables from the query key
        { fetcher: ({ requestId }) => fakeRequest((requestId + id) / 2) }
      : undefined
  );

  return (
    <section>
      <div data-testid={`query-${queryId}`}>Query {queryId}</div>
      <div data-testid={`loading-${queryId}`}>{isLoading ? 'Loading' : 'Loaded'}</div>
      <div data-testid={`error-${queryId}`}>{error?.message}</div>
      <div data-testid={`data-${queryId}`}>{data?.result}</div>
      <div data-testid={`refetch-data-${queryId}`}>{refetchResult?.data?.result}</div>
      <div data-testid={`refetch-error-${queryId}`}>{refetchResult?.error?.message}</div>
      <button data-testid={`plus-${queryId}`} onClick={() => setId((s) => s + 1)}>
        Plus
      </button>
      <button data-testid={`minus-${queryId}`} onClick={() => setId((s) => s - 1)}>
        Minus
      </button>
      <button
        data-testid={`refetch-${queryId}`}
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
  <Query queryId={1} defaultId={1}>
    <Query queryId={2} defaultId={2} />
    <Query queryId={3} defaultId={1}>
      <Query queryId={4} defaultId={2} noFetcher />
    </Query>
  </Query>
);

export { Query, Queries };
