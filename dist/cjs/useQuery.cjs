'use strict';

var useQuery$ = require('./useQuery_.cjs');
var useObservable = require('./useObservable.cjs');

const useQuery = options => useObservable.useObservable(useQuery$.useQuery$(options));

exports.useQuery = useQuery;
