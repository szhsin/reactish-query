import type { QueryStateMiddleware, QueryMeta } from '../types';

/**
 * Middleware that notifies callbacks when query data or error updates.
 *
 * Intended for client-side observers (for logging, metrics, or side-effects)
 * and runs outside React components. The middleware forwards the value to the
 * state setter and invokes the appropriate handler based on the `stateKey`.
 *
 * @example
 *  const middleware = queryObserver({ onData: (data, meta) => console.log(data, meta) });
 *  const queryClient = createQueryClient({ middleware });
 */
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
