import { createState } from 'reactish-state';
import type { StateBuilder, Middleware } from 'reactish-state';
import type { QueryStateMeta, QueryStateMiddleware, MiddlewareMeta } from './types';
import { createQueryCache } from './queryCache';

const createQueryClient = ({
  middleware
}: { middleware?: QueryStateMiddleware } = {}) => {
  const cache = createQueryCache();
  const state: StateBuilder<MiddlewareMeta> = createState({
    middleware: middleware as Middleware<QueryStateMeta>
  });
  return {
    getCache: () => cache,
    getState: () => state
  };
};

const defaultQueryClient = createQueryClient();

type QueryClient = typeof defaultQueryClient;

export { createQueryClient, defaultQueryClient, type QueryClient };
