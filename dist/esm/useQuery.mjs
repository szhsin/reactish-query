import { useSnapshot } from 'reactish-state';
import { UNDEFINED } from './utils.mjs';
import { useQuery$ } from './useQuery_.mjs';

const useQuery = options => {
  const {
    _: {
      p: isFetching$,
      d: data$,
      e: error$
    },
    ...rest
  } = useQuery$(options);
  const data = useSnapshot(data$);
  const error = useSnapshot(error$);
  return {
    data,
    error,
    isFetching: useSnapshot(isFetching$),
    isPending: data === UNDEFINED && !error,
    ...rest
  };
};

export { useQuery };
