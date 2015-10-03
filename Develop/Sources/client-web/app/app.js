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
var uibs       = require('angular-ui-bootstrap');
var leaflet    = require('leaflet');



// Others
var oclazyload   = require('oclazyload');
var material     = require('angular-material');
var bootstrap    = require('bootstrap');
var uibootstrap  = require('angular-ui-bootstrap');

// Css
require('./public/css/app.css');

// Modules
var appDirective = require('./app.directive');
var common       = require('./components/common/common');

// Admin page
//var admin.dashboard = require('components/admin.dashboard/admin.dashboard.routing');

// Store page

/* Script */
angular.module('app', [
    // Libs
    uiRoutes,
    ngAnimate,
    ngAria,
    'ngMdIcons',
    oclazyload,
    'ngMaterial',
    uibootstrap,

    // components
    common.name,
    //admin.dashboard.name
]).config(function($stateProvider,$urlRouterProvider,$mdThemingProvider){

    // Set up theme
    $mdThemingProvider.theme('default')
        .primaryPalette('green');

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app',{
            abstract: true,
            url: '/',
            template: '<app></app>'
        })
}).directive('app', appDirective);







