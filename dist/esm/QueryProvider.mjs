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
  // Ensures that even if a query client is accidentally re-created on every render,
  // it will still remain stable for queries.
  // This kind of mistake should always be fixed by the consumer of this library.
  const [initialClient] = useState(client || baseClient);
  return /*#__PURE__*/jsx(QueryContext.Provider, {
    value: useMemo(() => ({
      client: initialClient,
      defaultOptions: defaultOptions || baseOptions
    }), /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [stringify(defaultOptions), stringify(baseOptions)]),
    children: children
  });
};

export { QueryProvider };
