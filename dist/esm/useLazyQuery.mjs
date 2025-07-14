import { useQuery } from './useQuery.mjs';

const useLazyQuery = options => {
  const {
    refetch,
    ...rest
  } = useQuery({
    ...options,
    enabled: false
  });
  return [refetch, rest];
};

export { useLazyQuery };
