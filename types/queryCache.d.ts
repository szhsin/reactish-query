type QueryCache = {
    clear: () => void;
    get: (key: string, strong?: boolean) => object | undefined;
    set: (key: string, value: object, strong?: boolean) => void;
};
declare const createQueryCache: () => QueryCache;
export { createQueryCache, type QueryCache };
