import { useCallback } from 'react';
import { useQueryCore } from './useQueryCore.mjs';

const useLazyQuery$ = options => {
  const internalApi = useQueryCore({
    ...options,
    enabled: false
  });
  const fetchFn = internalApi.f;
  return {
    trigger: useCallback(args => fetchFn(args), [fetchFn]),
    args: internalApi.s.a,
    _: internalApi
  };
};

export { useLazyQuery$ };
