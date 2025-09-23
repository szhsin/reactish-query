'use strict';

var react = require('react');
var useQueryCore = require('./useQueryCore.cjs');

const useLazyQuery$ = options => {
  const internalApi = useQueryCore.useQueryCore({
    ...options,
    enabled: false
  });
  const fetchFn = internalApi.f;
  return {
    trigger: react.useCallback(args => fetchFn(args), [fetchFn]),
    args: internalApi.s.a,
    _: internalApi
  };
};

exports.useLazyQuery$ = useLazyQuery$;
