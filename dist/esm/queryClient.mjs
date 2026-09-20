import { createCache } from "./cache.mjs";
import { fetchCacheEntry, getStrCacheKey, isDataFresh } from "./queryCacheUtils.mjs";
import { stateBuilder } from "reactish-state";
//#region src/queryClient.ts
/**
* Create a query client instance.
*
* @param options.middleware Optional middleware used when creating per-query state.
* @returns An object with methods to interact with the query cache and its lifecycle.
*/
const createQueryClient = ({ middleware } = {}) => {
	const state = stateBuilder(middleware);
	const cache = createCache();
	const getCacheEntry = (queryMeta) => cache.get(getStrCacheKey(queryMeta));
	const createInitialState = (queryMeta, stateKey, initialValue) => state(initialValue, void 0, {
		...queryMeta,
		stateKey
	});
	const createDefaultCacheEntry = (queryMeta, queryFn) => [{
		d: createInitialState(queryMeta, "data"),
		e: createInitialState(queryMeta, "error"),
		f: createInitialState(queryMeta, "isFetching", false),
		p: createInitialState(queryMeta, "isPending", true),
		a: queryMeta?.args,
		r: !!queryMeta
	}, {
		i: 0,
		f: queryFn
	}];
	const resolveCacheEntry = (queryMeta, queryFn, shouldPersist, strQueryKey) => {
		const strCacheKey = getStrCacheKey(queryMeta, strQueryKey);
		let cacheEntry = cache.get(strCacheKey, shouldPersist);
		if (!cacheEntry) {
			cacheEntry = createDefaultCacheEntry(queryMeta, queryFn);
			cache.set(strCacheKey, cacheEntry, shouldPersist);
		}
		if (queryFn) cacheEntry[1].f = queryFn;
		return cacheEntry;
	};
	return {
		/** @internal [INTERNAL ONLY – DO NOT USE] */
		_: [createDefaultCacheEntry, resolveCacheEntry],
		/**
		* Clear the entire query cache.
		*/
		clear: () => cache.clear(),
		/**
		* Read cached data for a query. Returns `undefined` if not present.
		*
		* NOTE: This returns the current cached value as a plain (non-reactive)
		* snapshot. It should NOT be used directly in render paths.
		*/
		getData: (queryMeta) => getCacheEntry(queryMeta)?.[0].d.get(),
		/**
		* Set cached data for a query. Accepts either a value or an updater function.
		*
		* NOTE: Setting data to `undefined` is not supported,
		* as `undefined` represents the initial state with `isPending = true`.
		* If your data type allows `undefined`, include it in the `TData` type parameter.
		*/
		setData: (queryMeta, data) => getCacheEntry(queryMeta)?.[0].d.set(data),
		/**
		* Mark any in-flight fetch for the given query as canceled.
		* Any corresponding stale responses will be ignored.
		*/
		cancel: (queryMeta) => {
			const cacheEntry = getCacheEntry(queryMeta);
			if (cacheEntry) {
				cacheEntry[0].f.set(false);
				cacheEntry[1].i++;
			}
		},
		/**
		* Fetch data for a query and update the cache.
		*
		* If a matching cache entry exists, it is reused; otherwise a new entry is
		* created and persisted when appropriate.
		*
		* When `staleTime` is provided, cached data is returned immediately if it is
		* still considered fresh.
		*
		* This method can also be used to prefetch data and warm the cache ahead of time.
		*/
		fetch: ({ queryFn, staleTime, ...queryMeta }) => {
			const cacheEntry = resolveCacheEntry(queryMeta, queryFn, true);
			if (isDataFresh(cacheEntry, staleTime)) return { data: cacheEntry[0].d.get() };
			return fetchCacheEntry(queryMeta, cacheEntry);
		},
		/**
		* Invalidate a cached query, which triggers a refetch if a cache entry exists.
		* Returns the fetch result.
		*/
		invalidate: (queryMeta) => {
			const cacheEntry = getCacheEntry(queryMeta);
			if (cacheEntry) return fetchCacheEntry(queryMeta, cacheEntry);
		}
	};
};
const defaultQueryClient = createQueryClient();
//#endregion
export { createQueryClient, defaultQueryClient };
