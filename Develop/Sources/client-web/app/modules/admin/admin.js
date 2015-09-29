/**
 * Created by hoanglvq on 9/22/15.
 */

var angular = require('angular');
//var dashboardRouting = require('./components/dashboard/dashboard.routing');
var adminDirective = require('./admin.directive.js');

var admin = angular.module('admin',[
    //dashboardRouting.name
]).directive('admin',adminDirective);

module.exports = admin;
