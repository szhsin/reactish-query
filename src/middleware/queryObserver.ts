import type { QueryStateMiddleware, QueryStateMeta } from '../types';

const queryObserver =
  ({
    onData,
    onError
  }: {
    onData?: (data: unknown, meta: QueryStateMeta) => void;
    onError?: (error: Error, meta: QueryStateMeta) => void;
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
