import { useSnapshot } from 'reactish-state';
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
const useData = <TInput extends InputQueryResult>(input: TInput) =>
  ({
    ...input,
    /** Current snapshot of the query data */
    data: useSnapshot(input._.s.d) as unknown,
    /**
     * Whether the query is currently pending. This will be true initially
     * and becomes false once the `data` field is ready for use.
     */
    isPending: useSnapshot(input._.s.p)
  }) as TInput & QueryDataState<ExtractInputDataType<TInput>>;

/**
 * Attach `error` snapshot to the observable input.
 */
const useError = <TInput extends InputQueryResult>(input: TInput) => ({
  ...input,
  /** Current snapshot of the query error */
  error: useSnapshot(input._.s.e)
});

/**
 * Attach `isFetching` snapshot to the observable input.
 */
const useIsFetching = <TInput extends InputQueryResult>(input: TInput) => ({
  ...input,
  /** Current snapshot of whether the query is fetching */
  isFetching: useSnapshot(input._.s.f)
});

/**
 * Combine all helpers into the full observable API.
 *
 * Use this for consumer-facing hooks that need `data`, `error`,
 * `isFetching`, and `isPending` together.
 */
const useObservable = <TInput extends InputQueryResult>(input: TInput) =>
  useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
