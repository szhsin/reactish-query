'use strict';

var useQuery$ = require('./useQuery_.cjs');

const useLazyQuery$ = options => {
  const {
    refetch,
    _
  } = useQuery$.useQuery$({
    ...options,
    enabled: false
  });
  return {
    _,
    trigger: refetch,
    args: _.s.a
  };
};

exports.useLazyQuery$ = useLazyQuery$;
