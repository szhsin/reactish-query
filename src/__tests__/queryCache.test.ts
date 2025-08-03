import { type QueryCache, createQueryCache } from '../queryCache';

const targets = new Map<string, object>();
const weakRefs = new Map<object, WeakRef>();
let registryCallback: (heldValue: string) => void = () => {};

class WeakRef {
  private target?: object;
  constructor(target: object) {
    this.target = target;
    weakRefs.set(target, this);
    if ((target as { get: unknown }).get) {
      throw new Error('Mock WeakRef should not be used with real state');
    }
  }
  deref() {
    return this.target;
  }
  gc() {
    this.target = undefined;
  }
}

class FinalizationRegistry {
  constructor(callback: (heldValue: string) => void) {
    registryCallback = callback;
  }
  register(target: object, heldValue: string) {
    targets.set(heldValue, target);
  }
}

const console = {
  debug: vi.fn()
};

describe('queryCache', () => {
  describe('WeakRef and FinalizationRegistry', () => {
    let queryCache: QueryCache;
    beforeAll(() => {
      vi.stubGlobal('WeakRef', WeakRef);
      vi.stubGlobal('FinalizationRegistry', FinalizationRegistry);
      vi.stubGlobal('console', console);
      queryCache = createQueryCache();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    afterEach(() => {
      queryCache.clear();
    });

    it('delete cache key when target has been reclaimed', () => {
      queryCache.set('testKey1', { data: 'testData1' });
      expect(queryCache.get('testKey1')).toEqual({ data: 'testData1' });
      queryCache.set('testKey2', { data: 'testData2' });
      expect(queryCache.get('testKey2')).toEqual({ data: 'testData2' });

      weakRefs.get(targets.get('testKey1')!)?.gc();
      expect(queryCache.get('testKey1')).toBeUndefined();
      registryCallback('testKey1');
      expect(console.debug).toHaveBeenCalledTimes(1);
      expect(console.debug).toHaveBeenCalledWith('Cleared cache for key: testKey1');

      registryCallback('testKey2');
      expect(console.debug).toHaveBeenCalledTimes(1);

      queryCache.clear();
      registryCallback('testKey2');
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('not log in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      queryCache.set('testKey1', { data: 'testData1' });
      expect(queryCache.get('testKey1')).toEqual({ data: 'testData1' });
      weakRefs.get(targets.get('testKey1')!)?.gc();
      expect(queryCache.get('testKey1')).toBeUndefined();
      registryCallback('testKey1');
      expect(console.debug).not.toHaveBeenCalled();

      vi.unstubAllEnvs();
    });
  });

  describe('Map as fallback', () => {
    it('should use Map when WeakRef is not available', () => {
      vi.stubGlobal('WeakRef', undefined);
      expect(createQueryCache().constructor).toBe(Map);
      vi.unstubAllGlobals();
      vi.resetModules();
    });
  });
});
