type QueryCache = {
  clear: () => void;
  get: (key: string, strong?: boolean) => object | undefined;
  set: (key: string, value: object, strong?: boolean) => void;
};

const weakCache = (): QueryCache => {
  const cacheMap = new Map<string, WeakRef<object> | { deref?: () => undefined }>();
  const registry = new FinalizationRegistry<string>((heldValue) => {
    const ref = cacheMap.get(heldValue);
    if (ref?.deref && !ref.deref()) {
      cacheMap.delete(heldValue);
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Cleared cache for key: ${heldValue}`);
      }
    }
  });

  return {
    clear: () => cacheMap.clear(),

    get: (key, strong) => {
      const weakOrStrong = cacheMap.get(key);
      if (!weakOrStrong?.deref) return weakOrStrong;

      const value = weakOrStrong.deref();
      if (strong && value) {
        cacheMap.set(key, value);
        registry.unregister(value);
      }
      return value;
    },

    set: (key, value, strong) => {
      if (strong) {
        cacheMap.set(key, value);
      } else {
        cacheMap.set(key, new WeakRef(value));
        registry.register(value, key, value);
      }
    }
  };
};

const createQueryCache = (): QueryCache =>
  typeof WeakRef === 'function' ? weakCache() : new Map<string, object>();

export { createQueryCache, type QueryCache };
