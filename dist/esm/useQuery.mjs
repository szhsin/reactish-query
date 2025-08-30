import { useQuery$ } from './useQuery_.mjs';
import { useObservable } from './useObservable.mjs';

const useQuery = options => useObservable(useQuery$(options));

export { useQuery };
