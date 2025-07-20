import { type ReactNode, useState } from 'react';
import type { QueryState, QueryHookOptions } from '../types';
import { useMutation } from '../index';
import { fakeRequest } from './fakeRequest';

const Mutation = ({
  queryName,
  defaultId = 1,
  noKey,
  children,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  noKey?: boolean;
  children?: ReactNode;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode'>) => {
  const [id, setId] = useState(defaultId);
  const [refetchResult, setRefetchResult] = useState<QueryState<{ result: number }>>();
  const [trigger, { isFetching, error, data }] = useMutation<
    { result: number },
    { paramId: number },
    { keyId: number }
  >({
    ...queryOptions,
    ...(!noKey && { key: { keyId: id } }),
    // testing fetcher use both local and variables from the arguments
    fetcher: (arg) => fakeRequest(id + (arg.key?.keyId ?? 0) + arg.params.paramId)
  });

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
        data-testid={`trigger-${queryName}`}
        onClick={async () => {
          const result = await trigger({ paramId: id });
          setRefetchResult(result);
        }}
      >
        Trigger
      </button>
      {children}
    </section>
  );
};

export { Mutation };
