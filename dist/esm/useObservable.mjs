import { useSnapshot } from 'reactish-state';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */

const useData = input => ({
  ...input,
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  data: useSnapshot(input._.d),
  isPending: useSnapshot(input._.p)
});
const useError = input => ({
  ...input,
  error: useSnapshot(input._.e)
});
const useIsFetching = input => ({
  ...input,
  isFetching: useSnapshot(input._.f)
});
const useObservable = input => useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
