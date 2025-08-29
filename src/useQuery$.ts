import { useState, useEffect, useCallback } from 'react';
import { state as placeholderState } from 'reactish-state';
import type { StateBuilder } from 'reactish-state';
import type {
  Refetch,
  FetchResult,
  MiddlewareMeta,
  QueryStateKey,
  QueryStateMeta,
  QueryHookOptions
} from './types';
import type { QueryCacheEntry } from './types-internal';
import { UNDEFINED, stringify, QueryStateMapper } from './utils';
import { useQueryContext } from './useQueryContext';

const createInitialState = <TValue>(
  state: StateBuilder<MiddlewareMeta>,
  meta: QueryStateMeta | undefined,
  stateKey: QueryStateKey,
  initialValue?: TValue
) => state(initialValue, UNDEFINED, { ...meta, stateKey } as MiddlewareMeta);

const getDefaultQueryCacheEntry = <TData>(
  state: StateBuilder<MiddlewareMeta>,
  meta?: QueryStateMeta
) =>
  [
    {
      d: createInitialState(state, meta, QueryStateMapper.d),
      e: createInitialState(state, meta, QueryStateMapper.e),
      p: createInitialState(state, meta, QueryStateMapper.p, false)
    },
    { i: 0 }
  ] as QueryCacheEntry<TData>;

const useQuery$ = <TData, TKey = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}: QueryHookOptions<TData, TKey>) => {
  const {
    client: { getCache, getState },
    defaultOptions
  } = useQueryContext();
  const { cacheMode, staleTime = 0 } = { ...defaultOptions, ...options };
  const queryCache = getCache();
  const state = getState();
  const stringKey = stringify(queryKey) || '';
  const [queryCacheEntry, setQueryCacheEntry] = useState<QueryCacheEntry<TData>>(() =>
    getDefaultQueryCacheEntry(placeholderState)
  );

  const refetch = useCallback(
    async (args: unknown, declarative: boolean): Promise<FetchResult<TData>> => {
      let cacheEntry: QueryCacheEntry<TData>;
      const strKey = args !== UNDEFINED ? `${stringKey}|${stringify(args)}` : stringKey;
      const queryStateMeta: QueryStateMeta = { strKey, queryKey, args };

      if (cacheMode !== 'off') {
        const shouldPersist = cacheMode === 'persist';
        cacheEntry = queryCache.get(strKey, shouldPersist) as QueryCacheEntry<TData>;
        if (!cacheEntry) {
          cacheEntry = getDefaultQueryCacheEntry(state, queryStateMeta);
          queryCache.set(strKey, cacheEntry, shouldPersist);
        }
      } else {
        cacheEntry = getDefaultQueryCacheEntry(state, queryStateMeta);
      }
      setQueryCacheEntry(cacheEntry);

      const [
        {
          d: data$,
          e: { set: setError },
          p: { set: setIsFetching, get: getIsFetching }
        },
        cacheMeta
      ] = cacheEntry;

      if (
        !queryFn ||
        (declarative && (getIsFetching() || Date.now() - staleTime < cacheMeta.t!))
      ) {
        return Promise.resolve({});
      }

      setIsFetching(true);
      const requestSeq = ++cacheMeta.i;
      let data: TData | undefined, error: Error | undefined;

      try {
        data = await (queryFn as (mata: QueryStateMeta) => Promise<TData>)(
          queryStateMeta
        );
      } catch (err) {
        error = err as Error;
      }

      if (requestSeq === cacheMeta.i) {
        setIsFetching(false);
        if (error) {
          setError(error);
        } else {
          data$.set(data);
          setError(UNDEFINED);
          cacheMeta.t = Date.now();
        }
      }
      return { data, error };
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringKey, cacheMode, staleTime]
  );

  useEffect(() => {
    if (enabled) refetch(UNDEFINED, true);
  }, [enabled, refetch]);

  return {
    /** @internal Observable query state */
    _: queryCacheEntry[0],

    refetch: refetch as Refetch<TData>
  };
};

export { useQuery$ };
