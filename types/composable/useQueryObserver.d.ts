import type { QueryObserverOptions } from '../types';
import type { InputQueryResult, ExtractInputDataType } from '../types-internal';
/**
 * Attach observers to a query observable.
 *
 * Usage: compose with a query or mutation hook to run callbacks when data or
 * error updates. Observers run synchronously with state updates and are
 * unsubscribed automatically.
 *
 * @example
 *  const useQueryWithObserver = <TData, TKey = unknown>({
 *    onData,
 *    onError,
 *    ...options
 *  }: QueryHookOptions<TData, TKey> & QueryObserverOptions<TData>) =>
 *    useQueryObserver(useQuery(options), { onData, onError });
 */
declare const useQueryObserver: <TInput extends InputQueryResult>(input: TInput, { onData, onError }: QueryObserverOptions<ExtractInputDataType<TInput>>) => TInput;
export { useQueryObserver };
