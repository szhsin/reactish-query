import { useSnapshot } from 'reactish-state';
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
const useData = <TInput extends InputQueryResult>(input: TInput) =>
  ({
    ...input,
    /** Current snapshot of the query data */
    data: useSnapshot(input._.s.d) as unknown,
    /** Whether the query is currently pending */
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
 * Use for consumer-facing hooks that need `data`, `error`, and `isFetching/isPending` together.
 */
const useObservable = <TInput extends InputQueryResult>(input: TInput) =>
  useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
