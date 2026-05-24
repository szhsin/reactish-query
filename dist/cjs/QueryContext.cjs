'use strict';

var react = require('react');
var queryClient = require('./queryClient.cjs');

const QueryContext = /*#__PURE__*/react.createContext({
  client: queryClient.defaultQueryClient,
  defaultOptions: {}
});

exports.QueryContext = QueryContext;
