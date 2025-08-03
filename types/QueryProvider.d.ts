import type { ReactNode } from 'react';
import type { QueryClient } from './queryClient';
declare const QueryProvider: (props: {
    value: QueryClient;
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export { QueryProvider };
