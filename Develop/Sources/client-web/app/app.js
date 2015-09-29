/**
 * Created by hoanglvq on 9/22/15.
 */
/* Import */
var jquery     = require('jquery');

// Angular libs
var angular    = require('angular');
var uiRoutes   = require('angular-ui-router');
var ngAnimate  = require('angular-animate');
var ngAria     = require('angular-aria');
var ngMdIcons  = require('angular-material-icons');

// Others
var oclazyload = require('oclazyload');
var material   = require('angular-material');


// Css
//require('./app.css');

// Modules
var appDirective = require('./app.directive');
var common       = require('./modules/common/common');

//var storeRouting = require('modules/store/store.routing');
var adminRouting = require('./modules/admin/admin.routing');

/* Script */
angular.module('app', [
    uiRoutes,
    ngAnimate,
    ngAria,
    'ngMdIcons',
    oclazyload,
    'ngMaterial',
    common.name,
    //storeRouting.name,
    adminRouting.name
]).config(function($stateProvider,$urlRouterProvider,$mdThemingProvider){

    // Set up theme
    $mdThemingProvider.theme('altTheme')
        .primaryPalette('green');

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app',{
            abstract: true,
            url: '/',
            template: '<app></app>'
        })
}).directive('app', appDirective);
