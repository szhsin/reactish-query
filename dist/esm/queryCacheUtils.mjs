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
}, cacheMeta]) => {
  if (!cacheMeta.fn) return {};
  setIsFetching(true);
  const requestSeq = ++cacheMeta.i;
  let data, error;
  try {
    data = await cacheMeta.fn(queryMeta);
  } catch (err) {
    error = err;
  }
  if (requestSeq === cacheMeta.i) {
    setIsFetching(false);
    if (error) {
      setError(error);
    } else {
      setData(data);
      setError(UNDEFINED);
      setIsPending(false);
      cacheMeta.t = Date.now();
    }
  }
  return {
    data,
    error
  };
};

export { fetchCacheEntry, getStrCacheKey };
