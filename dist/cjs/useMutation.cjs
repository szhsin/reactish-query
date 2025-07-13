'use strict';

var useLazyQuery = require('./useLazyQuery.cjs');

const useMutation = (key, options) => useLazyQuery.useLazyQuery(key, {
  ...options,
  cacheMode: 'off'
});

exports.useMutation = useMutation;
