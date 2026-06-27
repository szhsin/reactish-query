import { defaultQueryClient } from "./queryClient.mjs";
import { createContext } from "react";
//#region src/QueryContext.ts
const QueryContext = createContext({
	client: defaultQueryClient,
	defaultOptions: {}
});
//#endregion
export { QueryContext };
