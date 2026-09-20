import { useLazyQuery } from "./useLazyQuery.mjs";
//#region src/useMutation.ts
/**
* Hook for mutations. Internally implemented as a lazy query with cache
* disabled. Returns the same API as `useLazyQuery` (trigger + render-ready state).
*
* @returns An object containing:
*  - `trigger` — function to manually execute the mutation
*  - `args` — the most recent arguments passed to `trigger`
*  - `data` — current mutation result
*  - `error` — current mutation error
*  - `isFetching` — whether the mutation is in progress
*  - `isPending` — whether the mutation is pending
*/
const useMutation = (options) => useLazyQuery({
	...options,
	cacheMode: "off"
});
//#endregion
export { useMutation };
