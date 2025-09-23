import type { FetchResult, QueryMeta } from './types';
import type { QueryCacheEntry } from './types-internal';
import { UNDEFINED, stringify } from './utils';

export const getStrCacheKey = (
  { queryKey, args }: QueryMeta,
  strQueryKey: string = stringify(queryKey) || ''
) => (args !== UNDEFINED ? `${strQueryKey}|${stringify(args)}` : strQueryKey);

export const fetchCacheEntry = async <TData>(
  queryMeta: QueryMeta,
  [
    {
      d: { set: setData },
      e: { set: setError },
      p: { set: setIsPending },
      f: { set: setIsFetching }
    },
    cacheEntryMutable
  ]: QueryCacheEntry<TData>
): Promise<FetchResult<TData>> => {
  if (!cacheEntryMutable.f) return {};

  setIsFetching(true);
  const requestSeq = ++cacheEntryMutable.i;
  let data: TData | undefined, error: Error | undefined;

  try {
    data = await cacheEntryMutable.f(queryMeta);
  } catch (err) {
    error = err as Error;
  }

  if (requestSeq === cacheEntryMutable.i) {
    setIsFetching(false);
    if (error) {
      setError(error);
    } else {
      setData(data);
      setError(UNDEFINED);
      setIsPending(false);
      cacheEntryMutable.t = Date.now();
    }
  }

  return { data, error };
};
