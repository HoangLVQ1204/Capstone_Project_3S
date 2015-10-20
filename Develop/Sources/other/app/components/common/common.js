/**
 * Created by hoanglvq on 9/22/15.
 */

var angular     = require('angular');
var authService = require('./auth.service');

var common = angular.module('common',[])
    .factory('authService',authService);

module.exports = common;