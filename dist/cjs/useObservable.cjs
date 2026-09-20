"use strict";
let reactish_state = require("reactish-state");
//#region src/useObservable.ts
/**
* Small composable helpers for observable query hooks.
*
* Designed to be combined with low-level `$` hooks (e.g., `useQuery$`,
* `useLazyQuery$`) to build custom hook shapes. Each helper attaches one or
* more snapshots to the input, enabling fine-grained reactivity. For example,
* `useData(useQuery$(options))` rerenders only when `data` changes.
*
* Attach `data` and `isPending` snapshot to the observable input.
*
* @example
* const { data, refetch } = useData(useQuery$({ queryKey: 'todos', queryFn }));
* // or make it reusable
* const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
*   useData(useQuery$(options));
*/
const useData = (input) => ({
	...input,
	/** Current snapshot of the query data */
	data: (0, reactish_state.useSnapshot)(input._.s.d),
	/**
	* Whether the query is currently pending. This will be true initially
	* and becomes false once the `data` field is ready for use.
	*/
	isPending: (0, reactish_state.useSnapshot)(input._.s.p)
});
/**
* Attach `error` snapshot to the observable input.
*/
const useError = (input) => ({
	...input,
	/** Current snapshot of the query error */
	error: (0, reactish_state.useSnapshot)(input._.s.e)
});
/**
* Attach `isFetching` snapshot to the observable input.
*/
const useIsFetching = (input) => ({
	...input,
	/** Current snapshot of whether the query is fetching */
	isFetching: (0, reactish_state.useSnapshot)(input._.s.f)
});
/**
* Combine all helpers into the full observable API.
*
* Use this for consumer-facing hooks that need `data`, `error`,
* `isFetching`, and `isPending` together.
*/
const useObservable = (input) => useData(useError(useIsFetching(input)));
//#endregion
exports.useData = useData;
exports.useError = useError;
exports.useIsFetching = useIsFetching;
exports.useObservable = useObservable;
