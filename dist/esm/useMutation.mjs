import { useLazyQuery } from './useLazyQuery.mjs';

const useMutation = options => useLazyQuery({
  ...options,
  cacheMode: 'off'
});

export { useMutation };
