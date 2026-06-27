"use strict";
let react = require("react");
//#region src/composable/useQueryObserver.ts
const useLayoutEffect = typeof window !== "undefined" ? react.useLayoutEffect : react.useEffect;
/**
* Attach observers to a query observable.
*
* Usage: compose with a query or mutation hook to run callbacks when data or
* error updates. Observers run synchronously with state updates and are
* unsubscribed automatically.
*
* @example
*  const useQueryWithObserver = <TData, TKey = unknown>({
*    onData,
*    onError,
*    ...options
*  }: QueryHookOptions<TData, TKey> & QueryObserverOptions<TData>) =>
*    useQueryObserver(useQuery(options), { onData, onError });
*/
const useQueryObserver = (input, { onData, onError }) => {
	const queryCacheEntry$ = input._.$;
	const [context] = (0, react.useState)({});
	useLayoutEffect(() => {
		context.d = onData;
		context.e = onError;
	}, [
		context,
		onData,
		onError
	]);
	useLayoutEffect(() => {
		const unsubscribeState = () => context.a?.forEach((unsubscribe) => unsubscribe());
		const listener = ([{ d: data$, e: error$, p: isPending$ }]) => {
			unsubscribeState();
			const { stateKey: _1, ...restData } = data$.meta();
			const metadata = restData;
			context.a = [data$.subscribe((data) => context.d?.(data, metadata)), error$.subscribe((error) => error && context.e?.(error, metadata))];
			if (!isPending$.get()) context.d?.(data$.get(), metadata);
			if (error$.get()) context.e?.(error$.get(), metadata);
		};
		const queryCacheEntry = queryCacheEntry$.get();
		if (queryCacheEntry[0].r) listener(queryCacheEntry, queryCacheEntry);
		const unsubscribeCacheEntry = queryCacheEntry$.subscribe(listener);
		return () => {
			unsubscribeState();
			unsubscribeCacheEntry();
		};
	}, [context, queryCacheEntry$]);
	return input;
};
//#endregion
exports.useQueryObserver = useQueryObserver;
