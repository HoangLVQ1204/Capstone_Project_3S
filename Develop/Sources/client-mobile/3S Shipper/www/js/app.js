// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.manages' is found in manages.js
var app = angular.module('starter', ['ionic', 'ngCordova','uiGmapgoogle-maps','angular-jwt']);

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
        templateUrl: 'templates/menu.html'
      })

      .state('sign-in',{
        url: '/sign-in',
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
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/tasks.html',
            controller: 'TasksCtrl'
          }
        }
      })
      .state('app.mapdemo',{
        url: '/mapdemo',
        views: {
          'menuContent': {
            templateUrl: 'templates/detail.html',
            controller: function ($scope) {
              // mode in ["all", "shipper", "store", "orderdetail"]
              var mode = "all";
              $scope.shippers = sampleData[mode].shipper;
              $scope.stores = sampleData[mode].store;
              $scope.customers = sampleData[mode].customer;
              $scope.orders = sampleData[mode].orders;

            }
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
    ;

    //Send token for each request
    jwtInterceptorProvider.tokenGetter = function(){
      return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/sign-in');
  });

// Sample Data from dataTest.json
var sampleData = {
  "all": {
    "shipper": [
      {
        "order" : ["order1"],
        "latitude": 21.028784,
        "longitude": 105.826088,
        "shipperID": "shipper_1",
        "status": "status 111",
        "currentDestination": {

        }
        /*
         "markerID"
         "geoText"
         "distance"
         "duration", // client

         "latitude"
         "longitude"
         "shipperID"
         "status"    // server
         */
      },
      {
        "order" : ["order3","order2"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      },
      {
        "order" : ["order4"],
        "latitude": 21.031918,
        "longitude": 105.826514,
        "shipperID": "shipper_3",
        "status": "status 333"
      }
    ],
    "store": [
      {
        "order" : ["order1","order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      },
      {
        "order" : ["order3","order4"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order" : ["order1","order3"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"

        /*
         "geoText"
         */
      },
      {
        "order" : ["order2"],
        "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
      },
      {
        "order" : ["order4"],
        "geoText": "112 Giảng Võ,Đống Đa,Hà Nội,Việt Nam"
      }
    ],
    "orders": {
      "order1": {
        "shipperID": "shipper_1",
        "storeID": "store_1"
      },
      "order2": {
        "shipperID": "shipper_2",
        "storeID": "store_1"
      },
      "order3": {
        "shipperID": "shipper_2",
        "storeID": "store_2"
      },
      "order4": {
        "shipperID": "shipper_3",
        "storeID": "store_2"
      }
    }
  },

  "shipper" : {   // detail of shipper_2
    "shipper": [
      {
        "order" : ["order2","order3"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store": [
      {
        "order": ["order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      },
      {
        "order": ["order3"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order": ["order3"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      },
      {
        "order": ["order2"],
        "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
      }
    ],
    "orders": {
      "order2": {
        "shipperID": "shipper_2",
        "storeID": "store_1"
      },
      "order3": {
        "shipperID": "shipper_2",
        "storeID": "store_2",
      }
    }
  },

  "store" : {     // detail of store_1
    "shipper": [
      {
        "order" : ["order1"],
        "latitude": 21.028784,
        "longitude": 105.826088,
        "shipperID": "shipper_1",
        "status": "status 111"
      },
      {
        "order" : ["order2"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store":[
      {
        "order": ["order1","order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      }
    ],
    "customer":[
      {
        "order" : ["order1"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      },
      {
        "order" : ["order2"],
        "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
      }
    ],
    "orders": {
      "order1": {
        "shipperID": "shipper_1",
        "storeID": "store_1"
      },
      "order2": {
        "shipperID": "shipper_2",
        "storeID": "store_1"
      }
    }
  },

  "orderdetail": {
    "shipper": [
      {
        "order": ["order1"]
      }
    ],
    "store": [
      {
        "order": ["order1"]
      }
    ],
    "custormer":[
      {
        "order": ["order1"]
      }
    ],
    "order": {
    }
  }
}
