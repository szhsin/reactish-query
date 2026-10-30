import { QueryContext } from "./QueryContext.mjs";
import { stringify } from "./utils.mjs";
import { useContext, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
// src/QueryProvider.tsx
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
export { QueryProvider };
