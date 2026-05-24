'use strict';

var useLazyQuery$ = require('./useLazyQuery_.cjs');
var useObservable = require('./useObservable.cjs');

const useLazyQuery = options => useObservable.useObservable(useLazyQuery$.useLazyQuery$(options));

exports.useLazyQuery = useLazyQuery;
