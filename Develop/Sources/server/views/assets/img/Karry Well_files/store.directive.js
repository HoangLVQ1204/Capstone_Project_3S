angular.module('app')
    .directive('store', function() {
            return {
                controller: 'storeController',
                templateUrl: '/components/store/store.html',
                controllerAs: 'vm',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
