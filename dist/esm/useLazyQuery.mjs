import { useLazyQuery$ } from './useLazyQuery_.mjs';
import { useObservable } from './useObservable.mjs';

const useLazyQuery = options => useObservable(useLazyQuery$(options));

export { useLazyQuery };
