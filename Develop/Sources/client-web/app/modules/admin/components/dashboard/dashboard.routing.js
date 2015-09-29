///**
// * Created by hoanglvq on 9/22/15.
// */
//var angular = require('angular');
//
//module.exports = angular.module('admin.dashboard.routing', [])
//    .config(function($stateProvider,$urlRouterProvider){
//        $urlRouterProvider.otherwise('/');
//        $stateProvider
//            .state('app.admin.dashboard',{
//                url : 'dashboard',
//                template: '<admin-dashboard></admin-dashboard>',
//                resolve: {
//                    loadAboutModule: function($q, $ocLazyLoad) {
//                        return $q(function(resolve) {
//                            require.ensure([], function() {
//                                var dashboardModule = require('./dashboard');
//                                $ocLazyLoad.inject(dashboardModule.name)
//                                    .then(function(injectedModules) {
//                                        resolve(dashboardModule);
//                                    }, function(err) {
//                                        console.log(err);
//                                    });
//                            });
//                        });
//                    }
//                }
//            });
//
//    });