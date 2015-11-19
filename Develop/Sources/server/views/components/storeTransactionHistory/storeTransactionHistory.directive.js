(function (ng) {
    angular.module('app')
        .directive('storeTransactionHistory', function () {
            return {
                controller: 'storeTransactionHistoryController',
                templateUrl: '/components/storeTransactionHistory/storeTransactionHistory.html',
                controllerAs: 'storeTransactionHistoryController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);