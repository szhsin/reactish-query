'use strict';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const UNDEFINED = /*#__PURE__*/(() => {})();
const stringify = JSON.stringify;
const QueryStateMapper = {
  d: 'data',
  e: 'error',
  p: 'isFetching'
};

exports.QueryStateMapper = QueryStateMapper;
exports.UNDEFINED = UNDEFINED;
exports.stringify = stringify;
