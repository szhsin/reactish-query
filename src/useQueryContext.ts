import { useContext } from 'react';
import { QueryContext } from './QueryContext';

const useQueryContext = () => useContext(QueryContext);

export { useQueryContext };
