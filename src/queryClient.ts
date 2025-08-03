import { createState, type Middleware } from 'reactish-state';
import { createQueryCache } from './queryCache';

const createQueryClient = (options: { middleware?: Middleware } = {}) => {
  const cache = createQueryCache();
  const state = createState(options);
  return {
    getCache: () => cache,
    getState: () => state
  };
};

const defaultQueryClient = createQueryClient();

type QueryClient = typeof defaultQueryClient;

export { createQueryClient, defaultQueryClient, type QueryClient };
