import { useObservable } from "./useObservable.mjs";
import { useLazyQuery$ } from "./useLazyQuery_.mjs";
//#region src/useLazyQuery.ts
/**
* Hook for lazy queries. Returns the same render-ready state as `useQuery`,
* but does not trigger a declarative (auto) fetch. Use the returned `trigger`
* to execute the query with arguments.
*
* @returns An object containing:
*  - `trigger` — function to manually execute the query
*  - `args` — the most recent arguments passed to `trigger`
*  - `data` — current query result
*  - `error` — current query error
*  - `isFetching` — whether the query is in progress
*  - `isPending` — whether the query is pending
*/
const useLazyQuery = (options) => useObservable(useLazyQuery$(options));
//#endregion
export { useLazyQuery };
