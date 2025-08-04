const eventListener = ({
  onSuccess,
  onError,
  onSettled
}) => ({
  set,
  get
}) => (value, context) => {
  set(value, context);
  const {
    data,
    error,
    isFetching
  } = get();
  if (isFetching) return;
  if (data !== undefined) onSuccess?.(data, context);
  if (error) onError?.(error, context);
  onSettled?.(data, error, context);
};

export { eventListener };
