
'use client';
'use strict';

var queryClient = require('./queryClient.cjs');
var QueryProvider = require('./QueryProvider.cjs');
var useQueryClient = require('./useQueryClient.cjs');
var useQuery = require('./useQuery.cjs');
var useLazyQuery = require('./useLazyQuery.cjs');
var useMutation = require('./useMutation.cjs');



exports.createQueryClient = queryClient.createQueryClient;
exports.defaultQueryClient = queryClient.defaultQueryClient;
exports.QueryProvider = QueryProvider.QueryProvider;
exports.useQueryClient = useQueryClient.useQueryClient;
exports.useQuery = useQuery.useQuery;
exports.useLazyQuery = useLazyQuery.useLazyQuery;
exports.useMutation = useMutation.useMutation;
