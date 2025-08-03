'use strict';

var QueryContext = require('./QueryContext.cjs');
var jsxRuntime = require('react/jsx-runtime');

const QueryProvider = props => /*#__PURE__*/jsxRuntime.jsx(QueryContext.QueryContext.Provider, {
  ...props
});

exports.QueryProvider = QueryProvider;
