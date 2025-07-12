type QueryCache = {
  clear: () => void;
  get: (key: string) => object | undefined;
  set: (key: string, value: object) => void;
};

const weakCache = (): QueryCache => {
  const cacheMap = new Map<string, WeakRef<object>>();
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
    clear: () => cacheMap.clear(),

    get: (key) => cacheMap.get(key)?.deref(),

    set: (key, value) => {
      cacheMap.set(key, new WeakRef(value));
      registry.register(value, key);
    }
  };
};

const queryCache: QueryCache =
  typeof WeakRef === 'function' ? weakCache() : new Map<string, object>();

export { queryCache, type QueryCache };
