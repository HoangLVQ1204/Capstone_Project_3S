var angular = require('angular');

module.exports = angular.module('guest.routing', [])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('app.guest',{
                url : 'guest/',
                template: '<guest></guest>',
                resolve:
                {
                    loadGuestModule: function($q, $ocLazyLoad) {
                        return $q(function(resolve) {
                            require.ensure([], function() {

                                var guestModule = require('./guest');

                                $ocLazyLoad.inject(guestModule.name)
                                    .then(function(injectedModules) {
                                        resolve(guestModule);
                                    }, function(err) {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }
            });

    });