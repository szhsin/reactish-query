import { useQuery$ } from "./useQuery_.mjs";
import { useData } from "./useObservable.mjs";
//#region src/useQueryData.ts
/**
* Convenience hook that exposes only `data` and `isPending` from a query.
*
* The returned state is **render-ready** and can be used directly in React
* components. Useful when you only care about the query result and
* pending state, without `error` or `isFetching`. Optimized for finer-grained reactivity.
*
* @returns An object containing:
*  - `data` — the current query data
*  - `isPending` — whether the query is pending
*  - `refetch` — function to manually refetch the query
*
* @example
* const { data, isPending } = useQueryData({ queryKey: 'todos', queryFn });
*/
const useQueryData = (options) => useData(useQuery$(options));
//#endregion
export { useQueryData };
