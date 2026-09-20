import { stringify } from "./utils.mjs";
import { QueryContext } from "./QueryContext.mjs";
import { useContext, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/QueryProvider.tsx
const QueryProvider = ({ children, client, defaultOptions }) => {
	const { client: baseClient, defaultOptions: baseOptions } = useContext(QueryContext);
	const [initialClient] = useState(client || baseClient);
	return /* @__PURE__ */ jsx(QueryContext.Provider, {
		value: useMemo(() => ({
			client: initialClient,
			defaultOptions: defaultOptions || baseOptions
		}), [stringify(defaultOptions), stringify(baseOptions)]),
		children
	});
};
//#endregion
export { QueryProvider };
