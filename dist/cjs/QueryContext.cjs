"use strict";
const require_queryClient = require("./queryClient.cjs");
//#region src/QueryContext.ts
const QueryContext = (0, require("react").createContext)({
	client: require_queryClient.defaultQueryClient,
	defaultOptions: {}
});
//#endregion
exports.QueryContext = QueryContext;
