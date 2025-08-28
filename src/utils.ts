import type { QueryStateKey } from './types';
import type { QueryStateCode } from './types-internal';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const UNDEFINED = (() => {})() as undefined;

export const stringify = JSON.stringify;

export const QueryStateMapper: Record<QueryStateCode, QueryStateKey> = {
  d: 'data',
  e: 'error',
  p: 'isFetching'
};
