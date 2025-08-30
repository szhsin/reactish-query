import type { State } from 'reactish-state';

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

export interface CacheEntryMeta {
  /** @internal Request sequence number */
  i: number;

  /** @internal Data timestamp */
  t?: number;
}

export type QueryCacheEntry<TData> = readonly [CacheEntryState<TData>, CacheEntryMeta];

export type QueryStateCode = keyof CacheEntryState<unknown>;
