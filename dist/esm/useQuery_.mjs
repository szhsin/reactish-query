import { useCallback } from 'react';
import { useQueryCore } from './useQueryCore.mjs';

const useQuery$ = options => {
  const internalApi = useQueryCore(options);
  const fetchFn = internalApi.f;
  return {
    refetch: useCallback(() => fetchFn(), [fetchFn]),
    _: internalApi
  };
};

export { useQuery$ };
