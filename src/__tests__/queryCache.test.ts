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
  unregister(token: object) {
    for (const [heldValue, target] of targets.entries()) {
      if (target === token) {
        targets.delete(heldValue);
        break;
      }
    }
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
      targets.clear();
      weakRefs.clear();
    });

    it('deletes cache key when target has been reclaimed', () => {
      queryCache.set('testKey1', { data: 'testData1' });
      expect(queryCache.get('testKey1')).toEqual({ data: 'testData1' });
      queryCache.set('testKey2', { data: 'testData2' });
      expect(queryCache.get('testKey2')).toEqual({ data: 'testData2' });

      weakRefs.get(targets.get('testKey1')!)?.gc();
      expect(queryCache.get('testKey1')).toBeUndefined();
      registryCallback('testKey1');
      expect(console.debug).toHaveBeenCalledTimes(1);
      expect(console.debug).toHaveBeenCalledWith('Cleared cache for key: testKey1');

      // Do not delete key when WeakRef still holds a value
      registryCallback('testKey2');
      expect(console.debug).toHaveBeenCalledTimes(1);

      // Do not delete key when key has been removed
      queryCache.clear();
      registryCallback('testKey2');
      expect(console.debug).toHaveBeenCalledTimes(1);

      // Do not delete key when the ref is strongly held
      queryCache.set('testKey3', { data: 'testData3' }, true);
      expect(queryCache.get('testKey3')).toEqual({ data: 'testData3' });
      registryCallback('testKey3');
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('converts between weak and strong references correctly', () => {
      expect(queryCache.get('testKey1')).toBeUndefined();
      expect(targets.get('testKey1')).toBeUndefined();

      expect(queryCache.get('testKey1', true)).toBeUndefined();
      expect(targets.get('testKey1')).toBeUndefined();

      queryCache.set('testKey1', { data: 'testData1' });
      expect(queryCache.get('testKey1')).toEqual({ data: 'testData1' });
      expect(targets.get('testKey1')).toEqual({ data: 'testData1' });

      expect(queryCache.get('testKey1', true)).toEqual({ data: 'testData1' });
      expect(targets.get('testKey1')).toBeUndefined();
      expect(queryCache.get('testKey1')).toEqual({ data: 'testData1' });

      queryCache.set('testKey2', { data: 'testData2' }, true);
      expect(queryCache.get('testKey2')).toEqual({ data: 'testData2' });
      expect(queryCache.get('testKey2', true)).toEqual({ data: 'testData2' });
      expect(targets.get('testKey2')).toBeUndefined();
    });

    it('does not log in production', () => {
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

  describe('Feature fallback', () => {
    it('uses Map as fallback when WeakRef is not available', () => {
      vi.stubGlobal('WeakRef', undefined);
      expect(createQueryCache().constructor).toBe(Map);
      vi.unstubAllGlobals();
      vi.resetModules();
    });
  });
});
