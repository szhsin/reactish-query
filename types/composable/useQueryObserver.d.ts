import type { QueryObserverOptions } from '../types';
import type { InputQueryResult, ExtractInputDataType } from '../types-internal';
declare const useQueryObserver: <TInput extends InputQueryResult>(input: TInput, { onData, onError }: QueryObserverOptions<ExtractInputDataType<TInput>>) => TInput;
export { useQueryObserver };
