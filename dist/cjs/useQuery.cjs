'use strict';

var react = require('react');
var reactishState = require('reactish-state');

const defaultQueryResult = {
  isLoading: false
};
const queryMap = new Map();
const useQuery = (key, {
  fetcher
} = {}) => {
  const [queryState, setQueryState] = react.useState(reactishState.state(defaultQueryResult));
  const stringKey = JSON.stringify(key);
  react.useEffect(() => {
    let queryState = queryMap.get(stringKey);
    if (!queryState) {
      queryState = reactishState.state(defaultQueryResult);
      queryMap.set(stringKey, queryState);
    }
    setQueryState(queryState);
    const {
      isLoading,
      data
    } = queryState.get();
    const {
      set: setQueryResult
    } = queryState;
    if (fetcher && !isLoading && data === undefined) {
      setQueryResult(prev => ({
        ...prev,
        isLoading: true
      }));
      fetcher().then(data => setQueryResult({
        data,
        isLoading: false
      })).catch(error => setQueryResult({
        error: error,
        isLoading: false
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringKey]);
  return reactishState.useSnapshot(queryState);
};

exports.useQuery = useQuery;
