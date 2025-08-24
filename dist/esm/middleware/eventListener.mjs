const eventListener = ({
  onSuccess,
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
      onSuccess?.(value, meta);
      break;
    case 'error':
      value && onError?.(value, meta);
      break;
  }
};

export { eventListener };
