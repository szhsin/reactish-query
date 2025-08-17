'use strict';

var react = require('react');
var QueryContext = require('./QueryContext.cjs');

const useQueryContext = () => react.useContext(QueryContext.QueryContext);

exports.useQueryContext = useQueryContext;
