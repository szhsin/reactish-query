import { stringify, UNDEFINED } from './utils.mjs';

const getStrCacheKey = ({
  queryKey,
  args
}, strQueryKey = stringify(queryKey) || '') => args !== UNDEFINED ? `${strQueryKey}|${stringify(args)}` : strQueryKey;
const fetchCacheEntry = async (queryMeta, [{
  d: {
    set: setData
  },
  e: {
    set: setError
  },
  p: {
    set: setIsPending
  },
  f: {
    set: setIsFetching
  }
}, cacheEntryMutable]) => {
  if (!cacheEntryMutable.fn) return {};
  setIsFetching(true);
  const requestSeq = ++cacheEntryMutable.i;
  let data, error;
  try {
    data = await cacheEntryMutable.fn(queryMeta);
  } catch (err) {
    error = err;
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
  return {
    data,
    error
  };
};

export { fetchCacheEntry, getStrCacheKey };
