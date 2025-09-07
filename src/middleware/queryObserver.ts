import type { QueryStateMiddleware, QueryMeta } from '../types';

const queryObserver =
  ({
    onData,
    onError
  }: {
    onData?: (data: unknown, meta: QueryMeta) => void;
    onError?: (error: Error, meta: QueryMeta) => void;
  }): QueryStateMiddleware =>
  ({ set }, { stateKey, ...meta }) =>
  (value) => {
    set(value);
    switch (stateKey) {
      case 'data':
        onData?.(value, meta);
        break;

      case 'error':
        if (value) onError?.(value as unknown as Error, meta);
        break;
    }
  };

export { queryObserver };
