
'use client';
'use strict';

var queryClient = require('./queryClient.cjs');
var QueryProvider = require('./QueryProvider.cjs');
var useQueryContext = require('./useQueryContext.cjs');
var useQuery = require('./useQuery.cjs');
var useLazyQuery = require('./useLazyQuery.cjs');
var useMutation = require('./useMutation.cjs');



exports.createQueryClient = queryClient.createQueryClient;
exports.defaultQueryClient = queryClient.defaultQueryClient;
exports.QueryProvider = QueryProvider.QueryProvider;
exports.useQueryContext = useQueryContext.useQueryContext;
exports.useQuery = useQuery.useQuery;
exports.useLazyQuery = useLazyQuery.useLazyQuery;
exports.useMutation = useMutation.useMutation;
