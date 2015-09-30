var angular = require('angular');

module.exports = angular.module('<%= name %>.routing', [])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('',{
                url : '',
                template: '<<%= name %>></<%= name %>>',
                resolve:
                {
                    loadGuestModule: function($q, $ocLazyLoad) {
                        return $q(function(resolve) {
                            require.ensure([], function() {

                                var <%= name %>Module = require('./<%= name %>');

                                $ocLazyLoad.inject(<%= name %>Module.name)
                                    .then(function(injectedModules) {
                                        resolve(<%= name %>Module);
                                    }, function(err) {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }
            });

    });