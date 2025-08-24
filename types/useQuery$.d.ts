import type { State } from 'reactish-state';
import type { FetchResult, QueryHookOptions } from './types';
declare const useQuery$: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => {
    /** @internal Observable query state */
    _: {
        /** @internal Observable query data */
        d: State<TData | undefined, unknown>;
        /** @internal Observable query error */
        e: State<Error | undefined>;
        /** @internal Observable for isFetching */
        p: State<boolean>;
    };
    refetch: (args: unknown, declarative: boolean) => Promise<FetchResult<TData>>;
};
export { useQuery$ };
