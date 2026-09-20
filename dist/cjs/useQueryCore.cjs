"use strict";
const require_utils = require("./utils.cjs");
const require_queryCacheUtils = require("./queryCacheUtils.cjs");
const require_useQueryContext = require("./useQueryContext.cjs");
let reactish_state = require("reactish-state");
let react = require("react");
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
	const { client: { _: [createDefaultCacheEntry, resolveCacheEntry] }, defaultOptions } = require_useQueryContext.useQueryContext();
	const { cacheMode, staleTime } = {
		...defaultOptions,
		...options
	};
	const strQueryKey = require_utils.stringify(queryKey);
	const [queryCacheEntry$] = (0, react.useState)(() => (0, reactish_state.state)(createDefaultCacheEntry()));
	const fetchFn = (0, react.useCallback)((args, declarative) => {
		const queryMeta = {
			queryKey,
			args
		};
		const cacheEntry = cacheMode !== "off" ? resolveCacheEntry(queryMeta, queryFn, cacheMode === "persist", strQueryKey) : createDefaultCacheEntry(queryMeta, queryFn);
		queryCacheEntry$.set(cacheEntry);
		if (declarative && (cacheEntry[0].f.get() || require_queryCacheUtils.isDataFresh(cacheEntry, staleTime))) return;
		return require_queryCacheUtils.fetchCacheEntry(queryMeta, cacheEntry);
	}, [
		strQueryKey,
		cacheMode,
		staleTime
	]);
	(0, react.useEffect)(() => {
		if (enabled) fetchFn(void 0, true);
	}, [enabled, fetchFn]);
	return {
		s: (0, reactish_state.useSnapshot)(queryCacheEntry$)[0],
		$: queryCacheEntry$,
		f: fetchFn
	};
};
//#endregion
exports.useQueryCore = useQueryCore;
