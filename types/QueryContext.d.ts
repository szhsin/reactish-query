import type { DefaultableOptions } from './types';
import { type QueryClient } from './queryClient';
interface QueryContextType {
    client: QueryClient;
    defaultOptions: DefaultableOptions;
}
declare const QueryContext: import("react").Context<QueryContextType>;
export { QueryContext, type QueryContextType };
