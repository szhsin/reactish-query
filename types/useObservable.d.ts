import type { QueryDataState } from './types';
import type { InputQueryResult, ExtractInputDataType } from './types-internal';
/**
 * Small composable helpers for observable query hooks.
 *
 * Purpose: combine with low-level `$` hooks (e.g., `useQuery$`, `useLazyQuery$`)
 * to build custom hook shapes. These helpers enable fine-grained reactivity:
 * composing a `$` hook with a single helper subscribes only to that slice
 * (for example, `useData(useQuery$(opts))` rerenders only when `data` changes).
 *
 * @example
 * const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
 *   useData(useQuery$(options));
 */
declare const useData: <TInput extends InputQueryResult>(input: TInput) => TInput & QueryDataState<ExtractInputDataType<TInput>>;
/**
 * Attach `error` snapshot to the observable input.
 */
declare const useError: <TInput extends InputQueryResult>(input: TInput) => TInput & {
    /** Current snapshot of the query error */
    error: Error | undefined;
};
/**
 * Attach `isFetching` snapshot to the observable input.
 */
declare const useIsFetching: <TInput extends InputQueryResult>(input: TInput) => TInput & {
    /** Current snapshot of whether the query is fetching */
    isFetching: boolean;
};
/**
 * Combine all helpers into the full observable API.
 *
 * Use for consumer-facing hooks that need `data`, `error`, and `isFetching/isPending` together.
 */
declare const useObservable: <TInput extends InputQueryResult>(input: TInput) => TInput & {
    /** Current snapshot of whether the query is fetching */
    isFetching: boolean;
} & {
    /** Current snapshot of the query error */
    error: Error | undefined;
} & QueryDataState<ExtractInputDataType<TInput & {
    /** Current snapshot of whether the query is fetching */
    isFetching: boolean;
} & {
    /** Current snapshot of the query error */
    error: Error | undefined;
}>>;
export { useData, useError, useIsFetching, useObservable };
