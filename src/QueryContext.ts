import { createContext } from 'react';
import { defaultQueryClient, type QueryClient } from './queryClient';

const QueryContext = createContext<QueryClient>(defaultQueryClient);

export { QueryContext };
