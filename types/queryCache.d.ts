type QueryCache = {
    clear: () => void;
    get: (key: string) => object | undefined;
    set: (key: string, value: object) => void;
};
declare const createQueryCache: () => QueryCache;
export { createQueryCache, type QueryCache };
