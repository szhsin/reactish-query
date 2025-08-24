import { applyMiddleware } from 'reactish-state/middleware';
import type { QueryStateMiddleware } from '../types';

const _applyMiddleware = applyMiddleware as (
  middlewares: (QueryStateMiddleware | undefined)[],
  options?: {
    fromRight?: boolean;
  }
) => QueryStateMiddleware;

export { _applyMiddleware as applyMiddleware };
