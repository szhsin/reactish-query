import type { State } from 'reactish-state';
import type { CacheQueryFn } from './types';
export interface CacheEntryImmutable<TData> {
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
     * Immutable per cache entry, so no observable is needed.
     */
    a: unknown;
    /**
     * @internal Indicates whether this is a resolved/real Cache Entry (as opposed to a placeholder).
     * Immutable per cache entry, so no observable is needed.
     */
    r: boolean;
}
export interface CacheEntryMutable<TData> {
    /** @internal Request sequence number */
    i: number;
    /** @internal Data timestamp */
    t?: number;
    /** @internal Query function */
    fn?: CacheQueryFn<TData>;
}
export type QueryCacheEntry<TData> = readonly [
    CacheEntryImmutable<TData>,
    CacheEntryMutable<TData>
];
export type QueryStateCode = keyof CacheEntryImmutable<unknown>;
export interface InternalHookApi<TData> {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
        /** @internal Cache entry immutable snapshot - ready for rendering */
        s: CacheEntryImmutable<TData>;
        /** @internal Observable query cache entry - do not render directly */
        $: State<QueryCacheEntry<TData>>;
    };
}
export type InputQueryResult = InternalHookApi<any>;
export type ExtractInputDataType<TInput> = TInput extends InternalHookApi<infer TData> ? TData : never;
