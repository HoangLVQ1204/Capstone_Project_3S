var angular = require('angular');

var storeDashboardDirective = require('./storeDashboard.directive.js');

var storeDashboard = angular.module('storeDashboard',[

]).directive('storeDashboard',storeDashboardDirective);

module.exports = storeDashboard;
