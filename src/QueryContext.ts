import { createContext } from 'react';
import type { MergeableOptions } from './types';
import { defaultQueryClient, type QueryClient } from './queryClient';

interface QueryContextType {
  client: QueryClient;
  defaultOptions: MergeableOptions;
}

const QueryContext = createContext<QueryContextType>({
  client: defaultQueryClient,
  defaultOptions: {}
});

export { QueryContext, type QueryContextType };
