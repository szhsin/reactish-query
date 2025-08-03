import { createState } from 'reactish-state';
import { createQueryCache } from './queryCache.mjs';

const createQueryClient = (options = {}) => {
  const cache = createQueryCache();
  const state = createState(options);
  return {
    getCache: () => cache,
    getState: () => state
  };
};
const defaultQueryClient = /*#__PURE__*/createQueryClient();

export { createQueryClient, defaultQueryClient };
