import type { QueryStateMiddleware, QueryStateMeta } from '../types';
declare const eventListener: ({ onSuccess, onError }: {
    onSuccess?: (data: unknown, meta: QueryStateMeta) => void;
    onError?: (error: Error, meta: QueryStateMeta) => void;
}) => QueryStateMiddleware;
export { eventListener };
