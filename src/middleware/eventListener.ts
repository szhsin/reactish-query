import type { QueryStateMiddleware, QueryStateMeta } from '../types';

const eventListener =
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
        value && onError?.(value as unknown as Error, meta);
        break;
    }
  };

export { eventListener };
