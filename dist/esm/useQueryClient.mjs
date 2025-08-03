import { useContext } from 'react';
import { QueryContext } from './QueryContext.mjs';

const useQueryClient = () => useContext(QueryContext);

export { useQueryClient };
