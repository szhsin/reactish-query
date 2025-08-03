'use strict';

var react = require('react');
var QueryContext = require('./QueryContext.cjs');

const useQueryClient = () => react.useContext(QueryContext.QueryContext);

exports.useQueryClient = useQueryClient;
