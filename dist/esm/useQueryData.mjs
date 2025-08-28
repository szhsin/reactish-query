import { useData } from './useObservable.mjs';
import { useQuery$ } from './useQuery_.mjs';

const useQueryData = options => useData(useQuery$(options));

export { useQueryData };
