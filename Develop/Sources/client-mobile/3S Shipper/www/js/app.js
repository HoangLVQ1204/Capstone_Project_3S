// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.manages' is found in manages.js
var app = angular.module('starter', ['ionic', 'ngCordova','uiGmapgoogle-maps','angular-jwt']);

  app.run(['$ionicPlatform', 'authService', '$rootScope', '$location', 'socketShipper', 'socketService', '$state', '$ionicLoading', function ($ionicPlatform, authService, $rootScope, $location, socketShipper, socketService, $state, $ionicLoading) {
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
    // window.localStorage.removeItem('EHID');
    ////Check Is firt time sign in
    if (authService.isLogged()) {
      socketService.connect()
      .then(function() {
        socketShipper.initHandlers();
        return socketService.authenSocket();
      }).then(function(){
          socketShipper.registerSocket();
          $rootScope.isGrabbing = false;
          $state.go("app.tasks");
        });
    } else {
      $state.go('sign-in');
    }
    $rootScope.isLoggedOut = false;
  }]);

app.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, jwtInterceptorProvider, $httpProvider, $ionicConfigProvider) {

  //Fix tab bottom in android
  $ionicConfigProvider.tabs.position('bottom');

  $httpProvider.interceptors.push(function($q) {
    return {
      responseError: function(rejection) {
        if(rejection.status == 0) {
          //window.location = "noresponse.html";
          console.log('API is offline, Plz check config hotServer. Try Again !');
          return;
        }
        return $q.reject(rejection);
      }
    };
  });

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAJ2h2y-g5g825gT_N13aMeU9NS0dsoK_Y',
    v: '3.20',
    libraries: 'geometry,visualization,drawing,places',
    language: 'vi'    
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
        cache: false,
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
      });

    //Send token for each request
    jwtInterceptorProvider.tokenGetter = function(){
      return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('sign-in');
  });
