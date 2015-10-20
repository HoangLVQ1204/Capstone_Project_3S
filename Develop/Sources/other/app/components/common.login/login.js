var angular = require('angular');

var loginDirective = require('./login.directive.js');

var login = angular.module('login',[

]).directive('login',loginDirective);

module.exports = login;
