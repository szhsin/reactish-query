import { useState, useEffect, useCallback } from 'react';
import { state as vanillaState, useSnapshot } from 'reactish-state';
import type { StateBuilder } from 'reactish-state';
import type {
  Refetch,
  FetchResult,
  MiddlewareMeta,
  QueryStateKey,
  QueryStateMeta,
  QueryHookOptions
} from './types';
import type { QueryCacheEntry, InternalHookApi } from './types-internal';
import { UNDEFINED, stringify } from './utils';
import { useQueryContext } from './useQueryContext';

const createInitialState = <TValue>(
  state: StateBuilder<MiddlewareMeta>,
  meta: QueryStateMeta,
  stateKey: QueryStateKey,
  initialValue?: TValue
) => state(initialValue, UNDEFINED, { ...meta, stateKey });

const getDefaultQueryCacheEntry = <TData>(
  state: StateBuilder<MiddlewareMeta>,
  meta: QueryStateMeta
) =>
  [
    {
      d: createInitialState(state, meta, 'data'),
      e: createInitialState(state, meta, 'error'),
      f: createInitialState(state, meta, 'isFetching', false),
      p: createInitialState(state, meta, 'isPending', true)
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
  const strQueryKey = stringify(queryKey) || '';
  const [queryCacheEntry] = useState(() =>
    vanillaState(getDefaultQueryCacheEntry<TData>(state, { queryKey }))
  );

  const refetch = useCallback(
    async (args: unknown, declarative: boolean): Promise<FetchResult<TData>> => {
      const cacheKey =
        args !== UNDEFINED ? `${strQueryKey}|${stringify(args)}` : strQueryKey;
      const queryStateMeta: QueryStateMeta = { queryKey, args };
      let cacheEntry: QueryCacheEntry<TData>;

      if (cacheMode !== 'off') {
        const shouldPersist = cacheMode === 'persist';
        cacheEntry = queryCache.get(cacheKey, shouldPersist) as QueryCacheEntry<TData>;
        if (!cacheEntry) {
          cacheEntry = getDefaultQueryCacheEntry(state, queryStateMeta);
          queryCache.set(cacheKey, cacheEntry, shouldPersist);
        }
      } else {
        cacheEntry = getDefaultQueryCacheEntry(state, queryStateMeta);
      }
      queryCacheEntry.set(cacheEntry);

      const [
        {
          d: data$,
          p: isPending$,
          e: { set: setError },
          f: { set: setIsFetching, get: getIsFetching }
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
          isPending$.set(false);
          setError(UNDEFINED);
          cacheMeta.t = Date.now();
        }
      }
      return { data, error };
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [strQueryKey, cacheMode, staleTime]
  );

  useEffect(() => {
    if (enabled) refetch(UNDEFINED, true);
  }, [enabled, refetch]);

  return {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
      s: useSnapshot(queryCacheEntry)[0],
      $: queryCacheEntry
    } as InternalHookApi<TData>,

    refetch: refetch as Refetch<TData>
  };
};

export { useQuery$ };
