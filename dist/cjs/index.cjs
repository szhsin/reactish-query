
'use client';
'use strict';

var queryClient = require('./queryClient.cjs');
var QueryProvider = require('./QueryProvider.cjs');
var useQueryContext = require('./useQueryContext.cjs');
var useQuery = require('./useQuery.cjs');
var useQuery$ = require('./useQuery_.cjs');
var useQueryData = require('./useQueryData.cjs');
var useLazyQuery = require('./useLazyQuery.cjs');
var useMutation = require('./useMutation.cjs');
var useObservable = require('./useObservable.cjs');



exports.createQueryClient = queryClient.createQueryClient;
exports.defaultQueryClient = queryClient.defaultQueryClient;
exports.QueryProvider = QueryProvider.QueryProvider;
exports.useQueryContext = useQueryContext.useQueryContext;
exports.useQuery = useQuery.useQuery;
exports.useQuery$ = useQuery$.useQuery$;
exports.useQueryData = useQueryData.useQueryData;
exports.useLazyQuery = useLazyQuery.useLazyQuery;
exports.useMutation = useMutation.useMutation;
exports.useData = useObservable.useData;
exports.useError = useObservable.useError;
exports.useIsFetching = useObservable.useIsFetching;
