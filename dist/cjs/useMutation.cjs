'use strict';

var useLazyQuery = require('./useLazyQuery.cjs');

const useMutation = options => useLazyQuery.useLazyQuery({
  ...options,
  cacheMode: 'off'
});

exports.useMutation = useMutation;
