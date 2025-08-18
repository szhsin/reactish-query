import type { ReactNode } from 'react';
import { useContext, useMemo, useState } from 'react';
import type { DefaultableOptions } from './types';
import type { QueryClient } from './queryClient';
import { QueryContext } from './QueryContext';
import { stringify } from './utils';

const QueryProvider = ({
  children,
  client,
  defaultOptions
}: {
  client?: QueryClient;
  defaultOptions?: DefaultableOptions;
  children: ReactNode;
}) => {
  const { client: baseClient, defaultOptions: baseOptions } = useContext(QueryContext);
  // Ensures that even if a query client is accidentally re-created on every render,
  // it will still remain stable for queries.
  // This kind of mistake should always be fixed by the consumer of this library.
  const [initialClient] = useState<QueryClient>(client || baseClient);

  return (
    <QueryContext.Provider
      value={useMemo(
        () => ({
          client: initialClient,
          defaultOptions: defaultOptions || baseOptions
        }),
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [stringify(defaultOptions), stringify(baseOptions)]
      )}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryProvider };
