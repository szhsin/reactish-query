import { type Cache, createCache } from '../cache';

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

describe('cache', () => {
  describe('WeakRef and FinalizationRegistry', () => {
    let cache: Cache;
    beforeAll(() => {
      vi.stubGlobal('WeakRef', WeakRef);
      vi.stubGlobal('FinalizationRegistry', FinalizationRegistry);
      vi.stubGlobal('console', console);
      cache = createCache();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    afterEach(() => {
      cache.clear();
      targets.clear();
      weakRefs.clear();
    });

    it('deletes cache key when target has been reclaimed', () => {
      cache.set('testKey1', { data: 'testData1' });
      expect(cache.get('testKey1')).toEqual({ data: 'testData1' });
      cache.set('testKey2', { data: 'testData2' });
      expect(cache.get('testKey2')).toEqual({ data: 'testData2' });

      weakRefs.get(targets.get('testKey1')!)?.gc();
      expect(cache.get('testKey1')).toBeUndefined();
      registryCallback('testKey1');
      expect(console.debug).toHaveBeenCalledTimes(1);
      expect(console.debug).toHaveBeenCalledWith('Cleared cache for key: testKey1');

      // Do not delete key when WeakRef still holds a value
      registryCallback('testKey2');
      expect(console.debug).toHaveBeenCalledTimes(1);

      // Do not delete key when key has been removed
      cache.clear();
      registryCallback('testKey2');
      expect(console.debug).toHaveBeenCalledTimes(1);

      // Do not delete key when the ref is strongly held
      cache.set('testKey3', { data: 'testData3' }, true);
      expect(cache.get('testKey3')).toEqual({ data: 'testData3' });
      registryCallback('testKey3');
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('converts between weak and strong references correctly', () => {
      expect(cache.get('testKey1')).toBeUndefined();
      expect(targets.get('testKey1')).toBeUndefined();

      expect(cache.get('testKey1', true)).toBeUndefined();
      expect(targets.get('testKey1')).toBeUndefined();

      cache.set('testKey1', { data: 'testData1' });
      expect(cache.get('testKey1')).toEqual({ data: 'testData1' });
      expect(targets.get('testKey1')).toEqual({ data: 'testData1' });

      expect(cache.get('testKey1', true)).toEqual({ data: 'testData1' });
      expect(targets.get('testKey1')).toBeUndefined();
      expect(cache.get('testKey1')).toEqual({ data: 'testData1' });

      cache.set('testKey2', { data: 'testData2' }, true);
      expect(cache.get('testKey2')).toEqual({ data: 'testData2' });
      expect(cache.get('testKey2', true)).toEqual({ data: 'testData2' });
      expect(targets.get('testKey2')).toBeUndefined();
    });

    it('does not log in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      cache.set('testKey1', { data: 'testData1' });
      expect(cache.get('testKey1')).toEqual({ data: 'testData1' });
      weakRefs.get(targets.get('testKey1')!)?.gc();
      expect(cache.get('testKey1')).toBeUndefined();
      registryCallback('testKey1');
      expect(console.debug).not.toHaveBeenCalled();

      vi.unstubAllEnvs();
    });
  });

  describe('Feature fallback', () => {
    it('uses Map as fallback when WeakRef is not available', () => {
      vi.stubGlobal('WeakRef', undefined);
      expect(createCache().constructor).toBe(Map);
      vi.unstubAllGlobals();
      vi.resetModules();
    });
  });
});
