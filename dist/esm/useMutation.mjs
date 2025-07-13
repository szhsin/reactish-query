import { useLazyQuery } from './useLazyQuery.mjs';

const useMutation = (key, options) => useLazyQuery(key, {
  ...options,
  cacheMode: 'off'
});

export { useMutation };
