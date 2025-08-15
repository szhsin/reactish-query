type QueryCache = {
  clear: () => void;
  get: (key: string, strong?: boolean) => object | undefined;
  set: (key: string, value: object, strong?: boolean) => void;
};

const weakCache = (): QueryCache => {
  const cacheMap = new Map<string, WeakRef<object>>();
  const strongRefs = new Set<object>();
  const registry = new FinalizationRegistry<string>((heldValue) => {
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

const createQueryCache = (): QueryCache =>
  typeof WeakRef === 'function' ? weakCache() : new Map<string, object>();

export { createQueryCache, type QueryCache };
