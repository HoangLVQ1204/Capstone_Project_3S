// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.manages' is found in manages.js
var app = angular.module('starter', ['ionic', 'ngCordova']);

  app.run(function ($ionicPlatform) {
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
      }
    });
  })


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })

      .state('sign-in',{
        url: '/sign-in',
        templateUrl: 'templates/sign-in.html',
        controller: 'SignInCtrl'
      })

      //.state('app.orderlist', {
      //  url: '/orderlist',
      //  views: {
      //    'menuContent': {
      //      templateUrl: 'templates/orderlist.html',
      //      controller: 'OrdersCtrl'
      //    }
      //  }
      //})

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
        url: '/detail/:orderId',
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
        //abstract: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/tasks.html',
            controller: 'TasksCtrl'
          }
        }
      })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/sign-in');
  });
