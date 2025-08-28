import type { QueryStateKey } from './types';
import type { QueryStateCode } from './types-internal';
export declare const UNDEFINED: undefined;
export declare const stringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
};
export declare const QueryStateMapper: Record<QueryStateCode, QueryStateKey>;
