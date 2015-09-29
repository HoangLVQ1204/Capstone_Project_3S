/**
 * Created by hoanglvq on 9/22/15.
 */

var angular = require('angular');

module.exports = angular.module('admin.routing', [])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('app.admin',{
                url : 'admin/',
                template: '<admin></admin>',
                resolve:
                {
                    loadGuestModule: function($q, $ocLazyLoad) {
                        return $q(function(resolve) {
                            require.ensure([], function() {
                                // download whole module and its dependencies
                                var adminModule = require('./admin');
                                //console.log(adminModule.name);
                                // register module to angular environment
                                $ocLazyLoad.inject(adminModule.name)
                                    .then(function(injectedModules) {
                                        // must resolve so that ui-router can continue to load template
                                        resolve(adminModule);
                                    }, function(err) {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }
            });

    });