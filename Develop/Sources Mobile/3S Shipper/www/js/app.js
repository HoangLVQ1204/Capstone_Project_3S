// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'exampleGeo', 'device', 'orders', 'history', 'issue', 'profile', 'status'])

  .run(function ($ionicPlatform) {
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

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
//cordova camera plugin
      .state('app.camera', {
        url: '/camera',
        views: {
          'menuContent': {
            templateUrl: 'templates/camera.html',
            controller: 'PictureCtrl'
          }
        }
      })

      //cordova device plugin
      .state('app.device', {
        url: '/device',
        views: {
          'menuContent': {
            templateUrl: 'templates/device.html',
            controller: 'DeviceCtrl'
          }
        }
      })

      //cordova geolocation plugin
      .state('app.geolocation', {
        url: '/geolocation',
        views: {
          'menuContent': {
            templateUrl: 'templates/geolocation.html',
            controller: 'GeoCtrl'
          }
        }
      })
      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      })

      .state('app.orderlist', {
        url: '/orderlist',
        views: {
          'menuContent': {
            templateUrl: 'templates/orderlist.html',
            controller: 'OrdersCtrl'
          }
        }
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
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/orderlist');
  });
