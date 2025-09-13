import type { State } from 'reactish-state';
import type { CacheQueryFn } from './types';
export interface CacheEntryState<TData> {
    /** @internal Observable query data */
    d: State<TData | undefined>;
    /** @internal Observable query error */
    e: State<Error | undefined>;
    /** @internal Observable for isFetching */
    f: State<boolean>;
    /** @internal Observable for isPending */
    p: State<boolean>;
    /**
     * @internal Lazy query/mutation arguments.
     * Immutable per cache entry, so no observable needed.
     */
    a: unknown;
}
export interface CacheEntryMeta<TData> {
    /** @internal Request sequence number */
    i: number;
    /** @internal Data timestamp */
    t?: number;
    /** @internal Query function */
    fn?: CacheQueryFn<TData>;
}
export type QueryCacheEntry<TData> = readonly [
    CacheEntryState<TData>,
    CacheEntryMeta<TData>
];
export type QueryStateCode = keyof CacheEntryState<unknown>;
export interface InternalHookApi<TData> {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
        /** @internal Query state snapshot - ready for rendering */
        s: CacheEntryState<TData>;
        /** @internal Observable query cache entry - do not render directly */
        $: State<QueryCacheEntry<TData>>;
    };
}
export type InputQueryResult = InternalHookApi<any>;
export type ExtractInputDataType<TInput> = TInput extends InternalHookApi<infer TData> ? TData : never;
