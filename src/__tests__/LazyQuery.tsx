import { type ReactNode, useState, useRef } from 'react';
import type { FetchResult, QueryHookOptions, LazyQueryHookOptions } from '../index';
import { useLazyQuery, useData, useLazyQuery$ } from '../index';
import { fakeRequest } from './fakeRequest';

const LazyQuery = ({
  queryName,
  defaultId = 1,
  requestVariation,
  children,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  requestVariation?: boolean;
  children?: ReactNode;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode'>) => {
  const variation = useRef(0);
  const [id, setId] = useState(defaultId);
  const [refetchResult, setRefetchResult] = useState<FetchResult<{ result: number }>>();
  const { isFetching, error, data, trigger } = useLazyQuery<
    { result: number },
    { paramId: number },
    { keyId: number }
  >({
    ...queryOptions,
    queryKey: { keyId: id },
    queryFn: (arg) => {
      // testing fetcher use both local and variables from the arguments
      let value = (id + arg.queryKey!.keyId + arg.args.paramId) / 3;
      // Normally, everything used in the fetcher should be included in the query key.
      // Here, we deliberately leave some out to mimic variant fetch results using the same key.
      if (requestVariation) value += variation.current * 0.1;
      return fakeRequest(
        { result: value },
        requestVariation ? (5 - variation.current) * 100 : 0
      );
    }
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
          if (requestVariation) variation.current++;
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

const useLazyQueryData = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TKey, TArgs>
) => useData(useLazyQuery$(options));

const LazyQueryData = ({
  queryName,
  defaultId = 1,
  children,
  render,
  ...queryOptions
}: {
  queryName: string;
  defaultId?: number;
  children?: ReactNode;
  render?: (queryName: string, id: number) => void;
} & Pick<QueryHookOptions<unknown, unknown>, 'cacheMode'>) => {
  const [id, setId] = useState(defaultId);
  const { isPending, data, trigger } = useLazyQueryData<
    number,
    { paramId: number },
    { keyId: number }
  >({
    ...queryOptions,
    queryKey: { keyId: id },
    queryFn: (arg) => fakeRequest((id + arg.queryKey!.keyId + arg.args.paramId) / 3)
  });

  if (isPending) {
    if (data !== undefined) throw new Error('Data should not have value when pending');
  } else {
    if (typeof data.toFixed() !== 'string')
      throw new Error('Data should have value when not pending');
  }

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
        data-testid={`trigger-${queryName}`}
        onClick={() => trigger({ paramId: id })}
      >
        Trigger
      </button>
      {children}
    </section>
  );
};

export { LazyQuery, LazyQueryData };
