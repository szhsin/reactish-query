import { useQuery } from './useQuery.mjs';

const useLazyQuery = (key, options) => {
  const {
    refetch,
    ...rest
  } = useQuery(key, {
    ...options,
    enabled: false
  });
  return [refetch, rest];
};

export { useLazyQuery };
