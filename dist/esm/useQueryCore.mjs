import { stringify } from "./utils.mjs";
import { fetchCacheEntry, isDataFresh } from "./queryCacheUtils.mjs";
import { useQueryContext } from "./useQueryContext.mjs";
import { state, useSnapshot } from "reactish-state";
import { useCallback, useEffect, useState } from "react";
//#region src/useQueryCore.ts
/**
* Low-level core hook for building custom abstractions.
*
* Exposes observable slices of query state so consumers can compose their own
* hooks.
*
* Enables fine-grained reactivity: combining a `$` hook with a single helper
* subscribes only to that slice.
*/
const useQueryCore = ({ queryKey, queryFn, enabled = true, ...options }) => {
	const { client: { _: [createDefaultCacheEntry, resolveCacheEntry] }, defaultOptions } = useQueryContext();
	const { cacheMode, staleTime } = {
		...defaultOptions,
		...options
	};
	const strQueryKey = stringify(queryKey);
	const [queryCacheEntry$] = useState(() => state(createDefaultCacheEntry()));
	const fetchFn = useCallback((args, declarative) => {
		const queryMeta = {
			queryKey,
			args
		};
		const cacheEntry = cacheMode !== "off" ? resolveCacheEntry(queryMeta, queryFn, cacheMode === "persist", strQueryKey) : createDefaultCacheEntry(queryMeta, queryFn);
		queryCacheEntry$.set(cacheEntry);
		if (declarative && (cacheEntry[0].f.get() || isDataFresh(cacheEntry, staleTime))) return;
		return fetchCacheEntry(queryMeta, cacheEntry);
	}, [
		strQueryKey,
		cacheMode,
		staleTime
	]);
	useEffect(() => {
		if (enabled) fetchFn(void 0, true);
	}, [enabled, fetchFn]);
	return {
		s: useSnapshot(queryCacheEntry$)[0],
		$: queryCacheEntry$,
		f: fetchFn
	};
};
//#endregion
export { useQueryCore };
