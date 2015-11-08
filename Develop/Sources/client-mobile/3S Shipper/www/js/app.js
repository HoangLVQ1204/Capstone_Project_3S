// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.manages' is found in manages.js
var app = angular.module('starter', ['ionic', 'ngCordova','uiGmapgoogle-maps','angular-jwt']);

  app.run(['$ionicPlatform', 'authService', '$rootScope', '$location', function ($ionicPlatform, authService, $rootScope, $location) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    ////Check Is firt time sign in
    if (authService.isLogged()) {
      $location.path('/app/tasks');
      $rootScope.$apply();
    } else {
      $location.path('/sign-in');
      $rootScope.$apply();
    }

  }]);

app.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, jwtInterceptorProvider, $httpProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyA_tcRSfGJdCCDLvGXGPZqdOMQC9bniNoo',
    v: '3.17',
    libraries: '',
    language: 'en',
    sensor: 'false',
  });
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        controller: 'ChangeStatusCtrl',
        templateUrl: 'templates/menu.html'
      })

      .state('sign-in',{
        url: '/sign-in',
        cache: false,
        templateUrl: 'templates/sign-in.html',
        controller: 'SignInCtrl'
      })

      .state('app.history', {
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'templates/history.html',
            controller: 'HistoryCtrl'
          }
        }
      })

      .state('app.detail', {
        url: '/detail/:orderId?isCancel',
        //"/contacts?myParam1&myParam2"
        views: {
          'menuContent': {
            templateUrl: 'templates/detail.html',
            controller: 'DetailCtrl'
          }
        }
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })

      .state('app.status', {
        url: '/status',
        views: {
          'menuContent': {
            templateUrl: 'templates/status.html',
            controller: 'StatusCtrl'
          }
        }
      })

      .state('app.issue', {
        url: '/issue',
        views: {
          'menuContent': {
            templateUrl: 'templates/issue.html',
            controller: 'IssueCtrl'
          }
        }
      })

      .state('app.tasks', {
        url: '/tasks',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/tasks.html',
            controller: 'TasksCtrl'
          }
        }
      })
      .state('app.map.mapdemo',{
        url: '/mapdemo',
        views: {
          'googleMap': {
            template: '<map shipper-markers="shippers" store-markers="stores" customer-markers="customers" orders="orders"></map>',
            controller: function ($scope) {
              // mode in ["all", "shipper", "store", "orderdetail"]
              console.log("v1");
              setTimeout(function(){
                var mode = "all";
                $scope.shippers = sampleData[mode].shipper;
                $scope.stores = sampleData[mode].store;
                $scope.customers = sampleData[mode].customer;
                $scope.orders = sampleData[mode].orders;
              }, 1000);


            }
          },
          'menuContent2':{
            templateUrl: 'templates/detail.html',
            controller: 'DetailCtrl'
          }
        },
        controller: function(){
          console.log("both");
        }
      })

      .state('app.bestway', {
        url: '/bestway/:tabParam',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/bestway.html',
            controller: 'BestWayCtrl'
          }
        }
      })

      .state('app.map', {
        url: '/map',
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/splitMap.html'
          }
        }
      })

      .state('app.grabs', {
        url: '/grabs',
        views: {
          'menuContent': {
            templateUrl: 'templates/grabs.html',
            controller: 'GrabCtrl'
          }
        }
      })
    ;

    //Send token for each request
    jwtInterceptorProvider.tokenGetter = function(){
      return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tasks');
  });
