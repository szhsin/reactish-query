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
  // Ensures that even if a query client is accidentally re-created on every render,
  // it will still remain stable for queries.
  // This kind of mistake should always be fixed by the consumer of this library.
  const [initialClient] = react.useState(client || baseClient);
  return /*#__PURE__*/jsxRuntime.jsx(QueryContext.QueryContext.Provider, {
    value: react.useMemo(() => ({
      client: initialClient,
      defaultOptions: defaultOptions || baseOptions
    }), /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [utils.stringify(defaultOptions), utils.stringify(baseOptions)]),
    children: children
  });
};

exports.QueryProvider = QueryProvider;
