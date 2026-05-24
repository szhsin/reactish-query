'use strict';

var react = require('react');
var useQueryCore = require('./useQueryCore.cjs');

const useQuery$ = options => {
  const internalApi = useQueryCore.useQueryCore(options);
  const fetchFn = internalApi.f;
  return {
    refetch: react.useCallback(() => fetchFn(), [fetchFn]),
    _: internalApi
  };
};

exports.useQuery$ = useQuery$;
