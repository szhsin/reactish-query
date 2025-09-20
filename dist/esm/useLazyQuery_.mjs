import { useQuery$ } from './useQuery_.mjs';

const useLazyQuery$ = options => {
  const {
    refetch,
    _
  } = useQuery$({
    ...options,
    enabled: false
  });
  return {
    _,
    trigger: refetch,
    args: _.s.a
  };
};

export { useLazyQuery$ };
