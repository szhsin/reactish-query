import { useSnapshot } from 'reactish-state';

const useData = input => ({
  ...input,
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  data: useSnapshot(input._.s.d),
  isPending: useSnapshot(input._.s.p)
});
const useError = input => ({
  ...input,
  error: useSnapshot(input._.s.e)
});
const useIsFetching = input => ({
  ...input,
  isFetching: useSnapshot(input._.s.f)
});
const useObservable = input => useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
