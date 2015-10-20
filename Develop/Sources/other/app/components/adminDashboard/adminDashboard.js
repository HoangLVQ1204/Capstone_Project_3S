var angular = require('angular');

var adminDashboardDirective = require('./adminDashboard.directive.js');

var adminDashboard = angular.module('adminDashboard',[

]).directive('adminDashboard',adminDashboardDirective);

module.exports = adminDashboard;
