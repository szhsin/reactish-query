import type { QueryStateMiddleware } from '../types';
declare const _applyMiddleware: (middlewares: (QueryStateMiddleware | undefined)[], options?: {
    fromRight?: boolean;
}) => QueryStateMiddleware;
export { _applyMiddleware as applyMiddleware };
