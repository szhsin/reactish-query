import { useContext } from 'react';
import { QueryContext } from './QueryContext';

const useQueryClient = () => useContext(QueryContext);

export { useQueryClient };
