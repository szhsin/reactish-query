import { createContext } from 'react';
import { defaultQueryClient } from './queryClient.mjs';

const QueryContext = /*#__PURE__*/createContext(defaultQueryClient);

export { QueryContext };
