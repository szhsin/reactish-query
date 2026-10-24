import { defaultQueryClient } from "./queryClient.mjs";
import { createContext } from "react";
// src/QueryContext.ts
const QueryContext = createContext({
	client: defaultQueryClient,
	defaultOptions: {}
});
export { QueryContext };
