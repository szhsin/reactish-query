import { stateBuilder } from 'reactish-state';
import { createCache } from './cache.mjs';
import { fetchCacheEntry, getStrCacheKey } from './queryCacheUtils.mjs';
import { UNDEFINED } from './utils.mjs';

const createQueryClient = ({
  middleware
} = {}) => {
  const state = stateBuilder(middleware);
  const cache = createCache();
  const getCacheEntry = queryMeta => cache.get(getStrCacheKey(queryMeta));
  const createInitialState = (queryMeta, stateKey, initialValue) => state(initialValue, UNDEFINED, {
    ...queryMeta,
    stateKey
  });
  const createDefaultCacheEntry = (queryMeta, queryFn) => [{
    d: createInitialState(queryMeta, 'data'),
    e: createInitialState(queryMeta, 'error'),
    f: createInitialState(queryMeta, 'isFetching', false),
    p: createInitialState(queryMeta, 'isPending', true),
    a: queryMeta?.args,
    r: !!queryMeta
  }, {
    i: 0,
    f: queryFn
  }];
  const resolveCacheEntry = (queryMeta, queryFn, shouldPersist, strQueryKey) => {
    const strCacheKey = getStrCacheKey(queryMeta, strQueryKey);
    let cacheEntry = cache.get(strCacheKey, shouldPersist);
    if (!cacheEntry) {
      cacheEntry = createDefaultCacheEntry(queryMeta, queryFn);
      cache.set(strCacheKey, cacheEntry, shouldPersist);
    }
    if (queryFn) cacheEntry[1].f = queryFn;
    return cacheEntry;
  };
  return {
    _: [createDefaultCacheEntry, resolveCacheEntry],
    clear: () => cache.clear(),
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
    }) => fetchCacheEntry(queryMeta, resolveCacheEntry(queryMeta, queryFn, true)),
    invalidate: queryMeta => {
      const cacheEntry = getCacheEntry(queryMeta);
      if (cacheEntry) return fetchCacheEntry(queryMeta, cacheEntry);
    }
  };
};
const defaultQueryClient = /*#__PURE__*/createQueryClient();

export { createQueryClient, defaultQueryClient };
