'use strict';

var useQuery = require('./useQuery.cjs');

const useLazyQuery = options => {
  const {
    refetch,
    ...rest
  } = useQuery.useQuery({
    ...options,
    enabled: false
  });
  return {
    ...rest,
    trigger: refetch
  };
};

exports.useLazyQuery = useLazyQuery;
