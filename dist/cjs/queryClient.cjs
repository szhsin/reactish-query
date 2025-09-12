'use strict';

var reactishState = require('reactish-state');
var cache = require('./cache.cjs');
var queryCacheUtils = require('./queryCacheUtils.cjs');
var utils = require('./utils.cjs');

const createQueryClient = ({
  middleware
} = {}) => {
  const state = reactishState.createState({
    middleware: middleware
  });
  const cache$1 = cache.createCache();
  const getCacheEntry = queryMeta => cache$1.get(queryCacheUtils.getStrCacheKey(queryMeta));
  const createInitialState = (queryMeta, stateKey, initialValue) => state(initialValue, utils.UNDEFINED, {
    ...queryMeta,
    stateKey
  });
  const createDefaultCacheEntry = (queryMeta, queryFn) => [{
    d: createInitialState(queryMeta, 'data'),
    e: createInitialState(queryMeta, 'error'),
    f: createInitialState(queryMeta, 'isFetching', false),
    p: createInitialState(queryMeta, 'isPending', true)
  }, {
    i: 0,
    fn: queryFn
  }];
  const resolveCacheEntry = (queryMeta, queryFn, shouldPersist, strQueryKey) => {
    const strCacheKey = queryCacheUtils.getStrCacheKey(queryMeta, strQueryKey);
    let cacheEntry = cache$1.get(strCacheKey, shouldPersist);
    if (!cacheEntry) {
      cacheEntry = createDefaultCacheEntry(queryMeta, queryFn);
      cache$1.set(strCacheKey, cacheEntry, shouldPersist);
    }
    if (queryFn) cacheEntry[1].fn = queryFn;
    return cacheEntry;
  };
  return {
    _: [createDefaultCacheEntry, resolveCacheEntry],
    clear: () => cache$1.clear(),
    getData: queryMeta => getCacheEntry(queryMeta)?.[0].d.get(),
    setData: (queryMeta, data) => getCacheEntry(queryMeta)?.[0].d.set(data),
    cancel: queryMeta => {
      const cacheEntry = getCacheEntry(queryMeta);
      if (cacheEntry) {
        cacheEntry[0].f.set(false);
        cacheEntry[1].i++;
      }
    },
    fetch: ({
      queryFn,
      ...queryMeta
    }) => queryCacheUtils.fetchCacheEntry(queryMeta, resolveCacheEntry(queryMeta, queryFn, true)),
    invalidate: queryMeta => {
      const cacheEntry = getCacheEntry(queryMeta);
      if (cacheEntry) return queryCacheUtils.fetchCacheEntry(queryMeta, cacheEntry);
    }
  };
};
const defaultQueryClient = /*#__PURE__*/createQueryClient();

exports.createQueryClient = createQueryClient;
exports.defaultQueryClient = defaultQueryClient;
