"use strict";
const require_utils = require("./utils.cjs");
//#region src/queryCacheUtils.ts
const getStrCacheKey = ({ queryKey, args }, strQueryKey = require_utils.stringify(queryKey) || "") => args !== void 0 ? `${strQueryKey}|${require_utils.stringify(args)}` : strQueryKey;
const isDataFresh = (cacheEntry, staleTime = 0) => Date.now() - staleTime < cacheEntry[1].t;
const fetchCacheEntry = async (queryMeta, [{ d: { set: setData }, e: { set: setError }, p: { set: setIsPending }, f: { set: setIsFetching } }, cacheEntryMutable]) => {
	if (!cacheEntryMutable.f) return {};
	setIsFetching(true);
	const requestSeq = ++cacheEntryMutable.i;
	let data, error;
	try {
		data = await cacheEntryMutable.f(queryMeta);
	} catch (err) {
		error = err;
	}
	if (requestSeq === cacheEntryMutable.i) {
		setIsFetching(false);
		if (error) setError(error);
		else {
			setData(data);
			setError(void 0);
			setIsPending(false);
			cacheEntryMutable.t = Date.now();
		}
	}
	return {
		data,
		error
	};
};
//#endregion
exports.fetchCacheEntry = fetchCacheEntry;
exports.getStrCacheKey = getStrCacheKey;
exports.isDataFresh = isDataFresh;
