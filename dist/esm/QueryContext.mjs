import { createContext } from 'react';
import { defaultQueryClient } from './queryClient.mjs';

const QueryContext = /*#__PURE__*/createContext({
  client: defaultQueryClient,
  defaultOptions: {}
});

export { QueryContext };
