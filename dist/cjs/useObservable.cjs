'use strict';

var reactishState = require('reactish-state');
var utils = require('./utils.cjs');

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */

const createObservable = code => input => ({
  ...input,
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  [utils.QueryStateMapper[code]]: reactishState.useSnapshot(input._[code])
});
const useData = /*#__PURE__*/createObservable('d');
const useError = /*#__PURE__*/createObservable('e');
const useIsFetching = /*#__PURE__*/createObservable('p');
const useObservable = input => useData(useError(useIsFetching(input)));

exports.useData = useData;
exports.useError = useError;
exports.useIsFetching = useIsFetching;
exports.useObservable = useObservable;
