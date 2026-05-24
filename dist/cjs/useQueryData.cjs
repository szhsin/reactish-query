'use strict';

var useObservable = require('./useObservable.cjs');
var useQuery$ = require('./useQuery_.cjs');

const useQueryData = options => useObservable.useData(useQuery$.useQuery$(options));

exports.useQueryData = useQueryData;
