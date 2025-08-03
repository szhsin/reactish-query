import { QueryContext } from './QueryContext.mjs';
import { jsx } from 'react/jsx-runtime';

const QueryProvider = props => /*#__PURE__*/jsx(QueryContext.Provider, {
  ...props
});

export { QueryProvider };
