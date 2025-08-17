import type { MergeableOptions } from './types';
import { type QueryClient } from './queryClient';
interface QueryContextType {
    client: QueryClient;
    defaultOptions: MergeableOptions;
}
declare const QueryContext: import("react").Context<QueryContextType>;
export { QueryContext, type QueryContextType };
