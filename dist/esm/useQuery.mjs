import { UNDEFINED } from './utils.mjs';
import { useQuery$ } from './useQuery_.mjs';
import { useObservable } from './useObservable.mjs';

const useQuery = options => {
  const result = useObservable(useQuery$(options));
  return {
    ...result,
    isPending: result.data === UNDEFINED && !result.error
  };
};

export { useQuery };
