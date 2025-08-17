import type { ReactNode } from 'react';
import type { MergeableOptions } from './types';
import type { QueryClient } from './queryClient';
declare const QueryProvider: ({ children, client, defaultOptions }: {
    client?: QueryClient;
    defaultOptions?: MergeableOptions;
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export { QueryProvider };
