import { useContext } from 'react';
import { QueryContext } from './QueryContext.mjs';

const useQueryContext = () => useContext(QueryContext);

export { useQueryContext };
