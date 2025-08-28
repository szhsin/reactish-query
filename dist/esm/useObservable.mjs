import { useSnapshot } from 'reactish-state';
import { QueryStateMapper } from './utils.mjs';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */

const createObservable = code => input => ({
  ...input,
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  [QueryStateMapper[code]]: useSnapshot(input._[code])
});
const useData = /*#__PURE__*/createObservable('d');
const useError = /*#__PURE__*/createObservable('e');
const useIsFetching = /*#__PURE__*/createObservable('p');
const useObservable = input => useData(useError(useIsFetching(input)));

export { useData, useError, useIsFetching, useObservable };
