import type { QueryDataState } from './types';
import type { InputQueryResult, ExtractInputDataType } from './types-internal';
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
 * Use this for consumer-facing hooks that need `data`, `error`,
 * `isFetching`, and `isPending` together.
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
