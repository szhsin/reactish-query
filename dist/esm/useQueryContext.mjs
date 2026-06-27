import { QueryContext } from "./QueryContext.mjs";
import { useContext } from "react";
//#region src/useQueryContext.ts
/**
* Access the current query client and default options from React context.
*
* Returns the value provided by `QueryProvider`. Use this inside hooks and
* components when you need to access the client or default options.
*/
const useQueryContext = () => useContext(QueryContext);
//#endregion
export { useQueryContext };
