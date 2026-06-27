import type { ReactNode } from 'react';
import type { DefaultableOptions } from './types';
import type { QueryClient } from './queryClient';
declare const QueryProvider: ({ children, client, defaultOptions }: {
    client?: QueryClient;
    defaultOptions?: DefaultableOptions;
    children: ReactNode;
}) => import("react").JSX.Element;
export { QueryProvider };
