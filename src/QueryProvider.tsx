import type { ReactNode } from 'react';
import type { QueryClient } from './queryClient';
import { QueryContext } from './QueryContext';

const QueryProvider = (props: { value: QueryClient; children: ReactNode }) => (
  <QueryContext.Provider {...props} />
);

export { QueryProvider };
