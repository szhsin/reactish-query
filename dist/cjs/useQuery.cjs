'use strict';

var reactishState = require('reactish-state');
var utils = require('./utils.cjs');
var useQuery$ = require('./useQuery_.cjs');

const useQuery = options => {
  const {
    _: {
      p: isFetching$,
      d: data$,
      e: error$
    },
    ...rest
  } = useQuery$.useQuery$(options);
  const data = reactishState.useSnapshot(data$);
  const error = reactishState.useSnapshot(error$);
  return {
    data,
    error,
    isFetching: reactishState.useSnapshot(isFetching$),
    isPending: data === utils.UNDEFINED && !error,
    ...rest
  };
};

exports.useQuery = useQuery;
