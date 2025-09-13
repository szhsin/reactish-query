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
    args: _.s.a,
    trigger: refetch
  };
};

exports.useLazyQuery$ = useLazyQuery$;
