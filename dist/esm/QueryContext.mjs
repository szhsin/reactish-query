import { createContext } from "react";
import { defaultQueryClient } from "./queryClient.mjs";
// src/QueryContext.ts
const QueryContext = createContext({
	client: defaultQueryClient,
	defaultOptions: {}
});
export { QueryContext };
