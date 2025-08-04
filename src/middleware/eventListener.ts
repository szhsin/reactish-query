import type { Middleware } from 'reactish-state';
import { QueryState, QueryMeta } from '../types';

const eventListener =
  ({
    onSuccess,
    onError,
    onSettled
  }: {
    onSuccess?: (data: unknown, queryMeta: QueryMeta) => void;
    onError?: (error: Error, queryMeta: QueryMeta) => void;
    onSettled?: (data: unknown, error: Error | undefined, queryMeta: QueryMeta) => void;
  }): Middleware =>
  ({ set, get }) =>
  (value, context) => {
    set(value, context);
    const { data, error, isFetching } = get() as QueryState<unknown>;
    if (isFetching) return;
    if (data !== undefined) onSuccess?.(data, context as QueryMeta);
    if (error) onError?.(error, context as QueryMeta);
    onSettled?.(data, error, context as QueryMeta);
  };

export { eventListener };
