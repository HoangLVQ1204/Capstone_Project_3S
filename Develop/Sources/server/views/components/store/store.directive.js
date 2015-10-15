angular.module('app')
    .directive('store', function() {
            return {
                controller: 'storeController',
                templateUrl: '/components/store/store.html',
                controllerAs: 'store',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })


