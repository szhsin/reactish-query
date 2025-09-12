'use strict';

var react = require('react');
var QueryContext = require('./QueryContext.cjs');
var utils = require('./utils.cjs');
var jsxRuntime = require('react/jsx-runtime');

const QueryProvider = ({
  children,
  client,
  defaultOptions
}) => {
  const {
    client: baseClient,
    defaultOptions: baseOptions
  } = react.useContext(QueryContext.QueryContext);
  const [initialClient] = react.useState(client || baseClient);
  return /*#__PURE__*/jsxRuntime.jsx(QueryContext.QueryContext.Provider, {
    value: react.useMemo(() => ({
      client: initialClient,
      defaultOptions: defaultOptions || baseOptions
    }), [utils.stringify(defaultOptions), utils.stringify(baseOptions)]),
    children: children
  });
};

exports.QueryProvider = QueryProvider;
