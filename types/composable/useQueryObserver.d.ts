import type { InputQueryResult, ExtractInputDataType } from '../types-internal';
declare const useQueryObserver: <TInput extends InputQueryResult>(input: TInput, { onData, onError }: {
    onData?: (data: ExtractInputDataType<TInput>) => void;
    onError?: (error: Error) => void;
}) => TInput;
export { useQueryObserver };
