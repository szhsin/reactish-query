import type { Middleware } from 'reactish-state';
import { QueryMeta } from '../types';
declare const eventListener: ({ onSuccess, onError, onSettled }: {
    onSuccess?: (data: unknown, queryMeta: QueryMeta) => void;
    onError?: (error: Error, queryMeta: QueryMeta) => void;
    onSettled?: (data: unknown, error: Error | undefined, queryMeta: QueryMeta) => void;
}) => Middleware;
export { eventListener };
