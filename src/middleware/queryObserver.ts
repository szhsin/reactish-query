import type { Middleware } from 'reactish-state';
import type { QueryMeta, MiddlewareMeta } from '../types';

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
    /**
     * Called when the data is updated.
     *
     * @param data The latest data from the query.
     * @param metadata Context information about the query.
     */
    onData?: (data: unknown, metadata: QueryMeta) => void;

    /**
     * Called when an error occurs.
     *
     * @param error The error that occurred.
     * @param metadata Context information about the query.
     */
    onError?: (error: Error, metadata: QueryMeta) => void;
  }): Middleware<MiddlewareMeta> =>
  ({ set, meta }) =>
  (value) => {
    set(value);
    const { stateKey, ...metadata } = meta();
    switch (stateKey) {
      case 'data':
        onData?.(value, metadata as QueryMeta);
        break;

      case 'error':
        if (value) onError?.(value as unknown as Error, metadata as QueryMeta);
        break;
    }
  };

export { queryObserver };
