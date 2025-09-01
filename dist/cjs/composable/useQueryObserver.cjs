'use strict';

var react = require('react');

const useLayoutEffect = typeof window !== 'undefined' ? react.useLayoutEffect : react.useEffect;
const useQueryObserver = (input, {
  onData,
  onError
} = {}) => {
  const queryCacheEntry$ = input._.$;
  const [context] = react.useState({});
  useLayoutEffect(() => {
    context.d = onData;
    context.e = onError;
  }, [context, onData, onError]);
  useLayoutEffect(() => {
    const unsubscribeState = () => context.a?.forEach(unsubscribe => unsubscribe());
    const unsubscribeCacheEntry = queryCacheEntry$.subscribe(([{
      d: data$,
      e: error$,
      p: isPending$
    }]) => {
      unsubscribeState();
      context.a = [
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      data$.subscribe(data => context.d?.(data)), error$.subscribe(error => error && context.e?.(error))];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      if (!isPending$.get()) context.d?.(data$.get());
      if (error$.get()) context.e?.(error$.get());
    });
    return () => {
      unsubscribeState();
      unsubscribeCacheEntry();
    };
  }, [context, queryCacheEntry$]);
  return input;
};

exports.useQueryObserver = useQueryObserver;
