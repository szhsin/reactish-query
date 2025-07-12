'use strict';

const weakCache = () => {
  const cacheMap = new Map();
  const registry = new FinalizationRegistry(heldValue => {
    const ref = cacheMap.get(heldValue);
    if (ref && !ref.deref()) {
      cacheMap.delete(heldValue);
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Cleared cache for key: ${heldValue}`);
      }
    }
  });
  return {
    clear: () => cacheMap.clear(),
    get: key => cacheMap.get(key)?.deref(),
    set: (key, value) => {
      cacheMap.set(key, new WeakRef(value));
      registry.register(value, key);
    }
  };
};
const queryCache = typeof WeakRef === 'function' ? weakCache() : new Map();

exports.queryCache = queryCache;
