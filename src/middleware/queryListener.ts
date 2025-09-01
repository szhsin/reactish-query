import type { QueryStateMiddleware, QueryStateMeta } from '../types';

const queryListener =
  ({
    onSuccess,
    onError
  }: {
    onSuccess?: (data: unknown, meta: QueryStateMeta) => void;
    onError?: (error: Error, meta: QueryStateMeta) => void;
  }): QueryStateMiddleware =>
  ({ set }, { stateKey, ...meta }) =>
  (value) => {
    set(value);
    switch (stateKey) {
      case 'data':
        onSuccess?.(value, meta);
        break;

      case 'error':
        if (value) onError?.(value as unknown as Error, meta);
        break;
    }
  };

export { queryListener };
