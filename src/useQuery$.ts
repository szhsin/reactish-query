import { useState, useEffect, useCallback } from 'react';
import { state as vanillaState, useSnapshot } from 'reactish-state';
import type { Refetch, CacheQueryFn, QueryMeta, QueryHookOptions } from './types';
import type { QueryCacheEntry, InternalHookApi } from './types-internal';
import { UNDEFINED, stringify } from './utils';
import { fetchCacheEntry } from './queryCacheUtils';
import { useQueryContext } from './useQueryContext';

/**
 * Low-level query hook for building custom abstractions.
 *
 * Exposes observable slices of query state so consumers can compose their own
 * hooks. Pair with helpers from `useObservable.ts` (e.g. `useData`, `useError`,
 * `useIsFetching`) to select specific slices.
 *
 * Enables fine-grained reactivity: combining a `$` hook with a single helper
 * subscribes only to that slice. For example,
 * `useData(useQuery$(options))` rerenders only when `data` changes (not when
 * `isFetching` or `error` updates).
 *
 * @returns An object containing:
 *  - `refetch` — function to refetch the query
 *
 * @example
 * const { data, refetch } = useData(useQuery$({ queryKey: 'todos', queryFn }));
 * const { data, error, refetch } = useData(useError(useQuery$({ queryKey: 'todos', queryFn })));
 * // or make it reusable
 * const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
 *   useData(useQuery$(options));
 */
const useQuery$ = <TData, TKey = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}: QueryHookOptions<TData, TKey>) => {
  const {
    client: {
      _: [createDefaultCacheEntry, resolveCacheEntry]
    },
    defaultOptions
  } = useQueryContext();
  const { cacheMode, staleTime = 0 } = { ...defaultOptions, ...options };
  const strQueryKey = stringify(queryKey);
  const [queryCacheEntry] = useState(() =>
    vanillaState((createDefaultCacheEntry as () => QueryCacheEntry<TData>)())
  );

  const refetch = useCallback(
    (args: unknown, declarative: boolean) => {
      const queryMeta: QueryMeta = { queryKey, args };

      const cacheEntry =
        cacheMode !== 'off'
          ? resolveCacheEntry(
              queryMeta,
              queryFn as CacheQueryFn<TData>,
              cacheMode === 'persist',
              strQueryKey
            )
          : createDefaultCacheEntry(queryMeta, queryFn as CacheQueryFn<TData>);

      queryCacheEntry.set(cacheEntry);

      const [cacheEntryImmutable, cacheEntryMutable] = cacheEntry;

      if (
        declarative &&
        (cacheEntryImmutable.f.get() || Date.now() - staleTime < cacheEntryMutable.t!)
      ) {
        // No return value needed since this is only called inside this query hook when declarative
        return;
      }

      return fetchCacheEntry(queryMeta, cacheEntry);
    },

    // `queryKey` and `queryFn` can be safely omitted from the dependency array
    // because they are correlated with `strQueryKey`.
    // `queryCacheEntry` and other values like `createDefaultCacheEntry` are constants
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [strQueryKey, cacheMode, staleTime]
  );

  useEffect(() => {
    if (enabled) refetch(UNDEFINED, true);
  }, [enabled, refetch]);

  return {
    /** Function to manually refetch the query */
    refetch,

    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
      s: useSnapshot(queryCacheEntry)[0],
      $: queryCacheEntry
    }
  } as { refetch: Refetch<TData> } & InternalHookApi<TData>;
};

export { useQuery$ };
