"use strict";
const require_QueryContext = require("./QueryContext.cjs");
let react = require("react");
//#region src/useQueryContext.ts
/**
* Access the current query client and default options from React context.
*
* Returns the value provided by `QueryProvider`. Use this inside hooks and
* components when you need to access the client or default options.
*/
const useQueryContext = () => (0, react.useContext)(require_QueryContext.QueryContext);
//#endregion
exports.useQueryContext = useQueryContext;
