import type { QueryStateMiddleware, QueryMeta } from '../types';
declare const queryObserver: ({ onData, onError }: {
    onData?: (data: unknown, meta: QueryMeta) => void;
    onError?: (error: Error, meta: QueryMeta) => void;
}) => QueryStateMiddleware;
export { queryObserver };
