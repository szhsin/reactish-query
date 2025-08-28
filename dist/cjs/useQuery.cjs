'use strict';

var utils = require('./utils.cjs');
var useQuery$ = require('./useQuery_.cjs');
var useObservable = require('./useObservable.cjs');

const useQuery = options => {
  const result = useObservable.useObservable(useQuery$.useQuery$(options));
  return {
    ...result,
    isPending: result.data === utils.UNDEFINED && !result.error
  };
};

exports.useQuery = useQuery;
