var angular = require('angular');

module.exports = angular.module('adminDashboard.routing', [])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('',{
                url : '',
                template: '<adminDashboard></adminDashboard>',
                resolve:
                {
                    loadGuestModule: function($q, $ocLazyLoad) {
                        return $q(function(resolve) {
                            require.ensure([], function() {

                                var adminDashboardModule = require('./adminDashboard');

                                $ocLazyLoad.inject(adminDashboardModule.name)
                                    .then(function(injectedModules) {
                                        resolve(adminDashboardModule);
                                    }, function(err) {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }
            });

    });