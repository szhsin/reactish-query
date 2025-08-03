'use strict';

var react = require('react');
var queryClient = require('./queryClient.cjs');

const QueryContext = /*#__PURE__*/react.createContext(queryClient.defaultQueryClient);

exports.QueryContext = QueryContext;
