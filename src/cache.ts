type Cache<TValue extends object = object> = {
  clear: () => void;
  get: (key: string, strong?: boolean) => TValue | undefined;
  set: (key: string, value: TValue, strong?: boolean) => void;
};

const weakCache = <TValue extends object>(): Cache<TValue> => {
  const cacheMap = new Map<string, WeakRef<TValue> | { deref?: () => undefined }>();
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
      if (!weakOrStrong?.deref) return weakOrStrong as TValue | undefined;

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

const createCache = <TValue extends object>(): Cache<TValue> =>
  typeof WeakRef === 'function' ? weakCache() : new Map<string, TValue>();

export { createCache, type Cache };
