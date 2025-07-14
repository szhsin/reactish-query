'use strict';

var useQuery = require('./useQuery.cjs');

const useLazyQuery = (key, options) => {
  const {
    refetch,
    ...rest
  } = useQuery.useQuery(key, {
    ...options,
    enabled: false
  });
  return [refetch, rest];
};

exports.useLazyQuery = useLazyQuery;
