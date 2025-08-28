import { type ReactNode, useState } from 'react';
import type { QueryHookOptions } from '../types';
import { useQueryData } from '../index';
import { fakeRequest } from './fakeRequest';

const QueryData = ({
  queryName,
  defaultId = 1,
  noFetcher,
  children,
  render,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  noFetcher?: boolean;
  children?: ReactNode;
  render?: (queryName: string, id: number) => void;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'enabled' | 'staleTime'>) => {
  const [id, setId] = useState(defaultId);
  const { data, refetch } = useQueryData({
    ...queryOptions,
    queryKey: { requestId: id },
    ...(!noFetcher && {
      // testing fetcher use both local and variables from the query key
      queryFn: (arg: { queryKey: { requestId: number } }) =>
        fakeRequest((arg.queryKey.requestId + id) / 2)
    })
  });

  render?.(queryName, id);

  return (
    <section>
      <div data-testid={`query-${queryName}`}>Query {queryName}</div>
      <div data-testid={`data-${queryName}`}>{data}</div>
      <button data-testid={`plus-${queryName}`} onClick={() => setId((s) => s + 1)}>
        Plus
      </button>
      <button data-testid={`minus-${queryName}`} onClick={() => setId((s) => s - 1)}>
        Minus
      </button>
      <button
        data-testid={`refetch-${queryName}`}
        onClick={async () => {
          await refetch();
        }}
      >
        Refetch
      </button>
      {children}
    </section>
  );
};

export { QueryData };
