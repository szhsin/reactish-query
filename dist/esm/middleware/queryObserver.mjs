//#region src/middleware/queryObserver.ts
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
const queryObserver = ({ onData, onError }) => ({ set, meta }) => (value) => {
	set(value);
	const { stateKey, ...metadata } = meta();
	switch (stateKey) {
		case "data":
			onData?.(value, metadata);
			break;
		case "error": if (value) onError?.(value, metadata);
	}
};
//#endregion
export { queryObserver };
