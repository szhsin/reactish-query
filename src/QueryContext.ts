import { createContext } from 'react';
import type { DefaultableOptions } from './types';
import { defaultQueryClient, type QueryClient } from './queryClient';

interface QueryContextType {
  client: QueryClient;
  defaultOptions: DefaultableOptions;
}

const QueryContext = createContext<QueryContextType>({
  client: defaultQueryClient,
  defaultOptions: {}
});

export { QueryContext, type QueryContextType };
