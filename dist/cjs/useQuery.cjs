"use strict";
const require_useQuery_ = require("./useQuery_.cjs");
const require_useObservable = require("./useObservable.cjs");
//#region src/useQuery.ts
/**
* React hook that exposes the full query state for rendering.
*
* Unlike low-level `$` hooks, the returned state is **ready to use in
* React render paths**.
*
* @returns An object containing:
*  - `data` — the current query data
*  - `error` — the current query error
*  - `isFetching` — whether the query is actively fetching
*  - `isPending` — whether the query is pending
*  - `refetch` — function to manually refetch the query
*/
const useQuery = (options) => require_useObservable.useObservable(require_useQuery_.useQuery$(options));
//#endregion
exports.useQuery = useQuery;
