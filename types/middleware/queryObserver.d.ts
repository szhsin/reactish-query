import type { QueryStateMiddleware, QueryStateMeta } from '../types';
declare const queryObserver: ({ onData, onError }: {
    onData?: (data: unknown, meta: QueryStateMeta) => void;
    onError?: (error: Error, meta: QueryStateMeta) => void;
}) => QueryStateMiddleware;
export { queryObserver };
