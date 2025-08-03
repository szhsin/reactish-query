import { type Middleware } from 'reactish-state';
declare const createQueryClient: (options?: {
    middleware?: Middleware;
}) => {
    getCache: () => import("./queryCache").QueryCache;
    getState: () => <T, A>(initialValue: T, actionBuilder?: import("reactish-state").ActionBuilder<T, A>, config?: import("reactish-state").Config) => import("reactish-state").StateWithAction<T, A>;
};
declare const defaultQueryClient: {
    getCache: () => import("./queryCache").QueryCache;
    getState: () => <T, A>(initialValue: T, actionBuilder?: import("reactish-state").ActionBuilder<T, A>, config?: import("reactish-state").Config) => import("reactish-state").StateWithAction<T, A>;
};
type QueryClient = typeof defaultQueryClient;
export { createQueryClient, defaultQueryClient, type QueryClient };
