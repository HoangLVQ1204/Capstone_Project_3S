var angular = require('angular');

var guestDirective = require('./guest.directive.js');

var guest = angular.module('guest',[

]).directive('guest',guestDirective);

module.exports = guest;
