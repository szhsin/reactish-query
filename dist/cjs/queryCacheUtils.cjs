'use strict';

var utils = require('./utils.cjs');

const getStrCacheKey = ({
  queryKey,
  args
}, strQueryKey = utils.stringify(queryKey) || '') => args !== utils.UNDEFINED ? `${strQueryKey}|${utils.stringify(args)}` : strQueryKey;
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
      setError(utils.UNDEFINED);
      setIsPending(false);
      cacheEntryMutable.t = Date.now();
    }
  }
  return {
    data,
    error
  };
};

exports.fetchCacheEntry = fetchCacheEntry;
exports.getStrCacheKey = getStrCacheKey;
