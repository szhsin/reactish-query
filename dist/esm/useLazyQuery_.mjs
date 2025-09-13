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
    args: _.s.a,
    trigger: refetch
  };
};

export { useLazyQuery$ };
