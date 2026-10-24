"use strict";
const require_queryClient = require("./queryClient.cjs");
// src/QueryContext.ts
const QueryContext = (0, require("react").createContext)({
	client: require_queryClient.defaultQueryClient,
	defaultOptions: {}
});
exports.QueryContext = QueryContext;
