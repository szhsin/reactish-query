'use strict';

var reactishState = require('reactish-state');

const useData = input => ({
  ...input,
  data: reactishState.useSnapshot(input._.s.d),
  isPending: reactishState.useSnapshot(input._.s.p)
});
const useError = input => ({
  ...input,
  error: reactishState.useSnapshot(input._.s.e)
});
const useIsFetching = input => ({
  ...input,
  isFetching: reactishState.useSnapshot(input._.s.f)
});
const useObservable = input => useData(useError(useIsFetching(input)));

exports.useData = useData;
exports.useError = useError;
exports.useIsFetching = useIsFetching;
exports.useObservable = useObservable;
