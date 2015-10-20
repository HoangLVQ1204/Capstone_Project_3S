var angular = require('angular');

module.exports = angular.module('login.routing', [])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('app.login',{
                url : '/login',
                template: '<login></login>',
                resolve:
                {
                    loadGuestModule: function($q, $ocLazyLoad) {
                        return $q(function(resolve) {
                            require.ensure([], function() {

                                var loginModule = require('./login');

                                $ocLazyLoad.inject(loginModule.name)
                                    .then(function(injectedModules) {
                                        resolve(loginModule);
                                    }, function(err) {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }
            });

    });