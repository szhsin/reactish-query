type QueryCache<TValue extends object = object> = {
    clear: () => void;
    get: (key: string, strong?: boolean) => TValue | undefined;
    set: (key: string, value: TValue, strong?: boolean) => void;
};
declare const createQueryCache: <TValue extends object>() => QueryCache<TValue>;
export { createQueryCache, type QueryCache };
