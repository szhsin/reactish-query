'use strict';

var reactishState = require('reactish-state');

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */

const useData = input => ({
  ...input,
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  data: reactishState.useSnapshot(input._.d),
  isPending: reactishState.useSnapshot(input._.p)
});
const useError = input => ({
  ...input,
  error: reactishState.useSnapshot(input._.e)
});
const useIsFetching = input => ({
  ...input,
  isFetching: reactishState.useSnapshot(input._.f)
});
const useObservable = input => useData(useError(useIsFetching(input)));

exports.useData = useData;
exports.useError = useError;
exports.useIsFetching = useIsFetching;
exports.useObservable = useObservable;
