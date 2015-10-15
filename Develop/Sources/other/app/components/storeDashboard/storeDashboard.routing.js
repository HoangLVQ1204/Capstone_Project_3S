var angular = require('angular');

module.exports = angular.module('storeDashboard.routing', [])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('',{
                url : '',
                template: '<storeDashboard></storeDashboard>',
                resolve:
                {
                    loadGuestModule: function($q, $ocLazyLoad) {
                        return $q(function(resolve) {
                            require.ensure([], function() {

                                var storeDashboardModule = require('./storeDashboard');

                                $ocLazyLoad.inject(storeDashboardModule.name)
                                    .then(function(injectedModules) {
                                        resolve(storeDashboardModule);
                                    }, function(err) {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }
            });

    });