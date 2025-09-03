const queryObserver = ({
  onData,
  onError
}) => ({
  set
}, {
  stateKey,
  ...meta
}) => value => {
  set(value);
  switch (stateKey) {
    case 'data':
      onData?.(value, meta);
      break;
    case 'error':
      if (value) onError?.(value, meta);
      break;
  }
};

export { queryObserver };
