type Cache<TValue extends object = object> = {
    clear: () => void;
    get: (key: string, strong?: boolean) => TValue | undefined;
    set: (key: string, value: TValue, strong?: boolean) => void;
};
declare const createCache: <TValue extends object>() => Cache<TValue>;
export { createCache, type Cache };
