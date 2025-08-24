import type { StateBuilder } from 'reactish-state';
import type { QueryStateMiddleware, MiddlewareMeta } from './types';
declare const createQueryClient: ({ middleware }?: {
    middleware?: QueryStateMiddleware;
}) => {
    getCache: () => import("./queryCache").QueryCache;
    getState: () => StateBuilder<MiddlewareMeta<unknown, unknown>>;
};
declare const defaultQueryClient: {
    getCache: () => import("./queryCache").QueryCache;
    getState: () => StateBuilder<MiddlewareMeta<unknown, unknown>>;
};
type QueryClient = typeof defaultQueryClient;
export { createQueryClient, defaultQueryClient, type QueryClient };
