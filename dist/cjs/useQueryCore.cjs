'use strict';

var react = require('react');
var reactishState = require('reactish-state');
var utils = require('./utils.cjs');
var queryCacheUtils = require('./queryCacheUtils.cjs');
var useQueryContext = require('./useQueryContext.cjs');

const useQueryCore = ({
  queryKey,
  queryFn,
  enabled = true,
  ...options
}) => {
  const {
    client: {
      _: [createDefaultCacheEntry, resolveCacheEntry]
    },
    defaultOptions
  } = useQueryContext.useQueryContext();
  const {
    cacheMode,
    staleTime = 0
  } = {
    ...defaultOptions,
    ...options
  };
  const strQueryKey = utils.stringify(queryKey);
  const [queryCacheEntry] = react.useState(() => reactishState.state(createDefaultCacheEntry()));
  const fetchFn = react.useCallback((args, declarative) => {
    const queryMeta = {
      queryKey,
      args
    };
    const cacheEntry = cacheMode !== 'off' ? resolveCacheEntry(queryMeta, queryFn, cacheMode === 'persist', strQueryKey) : createDefaultCacheEntry(queryMeta, queryFn);
    queryCacheEntry.set(cacheEntry);
    const [cacheEntryImmutable, cacheEntryMutable] = cacheEntry;
    if (declarative && (cacheEntryImmutable.f.get() || Date.now() - staleTime < cacheEntryMutable.t)) {
      return;
    }
    return queryCacheUtils.fetchCacheEntry(queryMeta, cacheEntry);
  }, [strQueryKey, cacheMode, staleTime]);
  react.useEffect(() => {
    if (enabled) fetchFn(utils.UNDEFINED, true);
  }, [enabled, fetchFn]);
  return {
    s: reactishState.useSnapshot(queryCacheEntry)[0],
    $: queryCacheEntry,
    f: fetchFn
  };
};

exports.useQueryCore = useQueryCore;
