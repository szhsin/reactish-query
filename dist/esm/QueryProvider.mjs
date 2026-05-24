import { useContext, useState, useMemo } from 'react';
import { QueryContext } from './QueryContext.mjs';
import { stringify } from './utils.mjs';
import { jsx } from 'react/jsx-runtime';

const QueryProvider = ({
  children,
  client,
  defaultOptions
}) => {
  const {
    client: baseClient,
    defaultOptions: baseOptions
  } = useContext(QueryContext);
  const [initialClient] = useState(client || baseClient);
  return /*#__PURE__*/jsx(QueryContext.Provider, {
    value: useMemo(() => ({
      client: initialClient,
      defaultOptions: defaultOptions || baseOptions
    }), [stringify(defaultOptions), stringify(baseOptions)]),
    children: children
  });
};

export { QueryProvider };
