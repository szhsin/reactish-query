"use strict";
const require_utils = require("./utils.cjs");
const require_QueryContext = require("./QueryContext.cjs");
let react = require("react");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/QueryProvider.tsx
const QueryProvider = ({ children, client, defaultOptions }) => {
	const { client: baseClient, defaultOptions: baseOptions } = (0, react.useContext)(require_QueryContext.QueryContext);
	const [initialClient] = (0, react.useState)(client || baseClient);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(require_QueryContext.QueryContext.Provider, {
		value: (0, react.useMemo)(() => ({
			client: initialClient,
			defaultOptions: defaultOptions || baseOptions
		}), [require_utils.stringify(defaultOptions), require_utils.stringify(baseOptions)]),
		children
	});
};
//#endregion
exports.QueryProvider = QueryProvider;
