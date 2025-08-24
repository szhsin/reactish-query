import { createState } from 'reactish-state';
import { createQueryCache } from './queryCache.mjs';

const createQueryClient = ({
  middleware
} = {}) => {
  const cache = createQueryCache();
  const state = createState({
    middleware: middleware
  });
  return {
    getCache: () => cache,
    getState: () => state
  };
};
const defaultQueryClient = /*#__PURE__*/createQueryClient();

export { createQueryClient, defaultQueryClient };
