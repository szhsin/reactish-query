'use strict';

var reactishState = require('reactish-state');
var queryCache = require('./queryCache.cjs');

const createQueryClient = (options = {}) => {
  const cache = queryCache.createQueryCache();
  const state = reactishState.createState(options);
  return {
    getCache: () => cache,
    getState: () => state
  };
};
const defaultQueryClient = /*#__PURE__*/createQueryClient();

exports.createQueryClient = createQueryClient;
exports.defaultQueryClient = defaultQueryClient;
