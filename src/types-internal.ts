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
    /** @internal Query state snapshot - safe for rendering */
    s: CacheEntryState<TData>;

    /** @internal Observable query cache entry - do not render directly */
    $: State<QueryCacheEntry<TData>>;
  };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type InputQueryResult = InternalHookApi<any>;

export type ExtractInputDataType<TInput> =
  TInput extends InternalHookApi<infer TData> ? TData : never;
