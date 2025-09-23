'use strict';

var react = require('react');

const useLayoutEffect = typeof window !== 'undefined' ? react.useLayoutEffect : react.useEffect;
const useQueryObserver = (input, {
  onData,
  onError
}) => {
  const queryCacheEntry$ = input._.$;
  const [context] = react.useState({});
  useLayoutEffect(() => {
    context.d = onData;
    context.e = onError;
  }, [context, onData, onError]);
  useLayoutEffect(() => {
    const unsubscribeState = () => context.a?.forEach(unsubscribe => unsubscribe());
    const listener = ([{
      d: data$,
      e: error$,
      p: isPending$
    }]) => {
      unsubscribeState();
      context.a = [data$.subscribe(data => context.d?.(data)), error$.subscribe(error => error && context.e?.(error))];
      if (!isPending$.get()) context.d?.(data$.get());
      if (error$.get()) context.e?.(error$.get());
    };
    const queryCacheEntry = queryCacheEntry$.get();
    if (queryCacheEntry[0].r) listener(queryCacheEntry);
    const unsubscribeCacheEntry = queryCacheEntry$.subscribe(listener);
    return () => {
      unsubscribeState();
      unsubscribeCacheEntry();
    };
  }, [context, queryCacheEntry$]);
  return input;
};

exports.useQueryObserver = useQueryObserver;
