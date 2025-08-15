const weakCache = () => {
  const cacheMap = new Map();
  const strongRefs = new Set();
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
    clear: () => {
      cacheMap.clear();
      strongRefs.clear();
    },
    get: (key, strong) => {
      const value = cacheMap.get(key)?.deref();
      if (strong && value) strongRefs.add(value);
      return value;
    },
    set: (key, value, strong) => {
      cacheMap.set(key, new WeakRef(value));
      registry.register(value, key);
      if (strong) strongRefs.add(value);
    }
  };
};
const createQueryCache = () => typeof WeakRef === 'function' ? weakCache() : new Map();

export { createQueryCache };
