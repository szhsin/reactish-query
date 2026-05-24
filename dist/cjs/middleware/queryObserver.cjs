'use strict';

const queryObserver = ({
  onData,
  onError
}) => ({
  set,
  meta
}) => value => {
  set(value);
  const {
    stateKey,
    ...metadata
  } = meta();
  switch (stateKey) {
    case 'data':
      onData?.(value, metadata);
      break;
    case 'error':
      if (value) onError?.(value, metadata);
      break;
  }
};

exports.queryObserver = queryObserver;
