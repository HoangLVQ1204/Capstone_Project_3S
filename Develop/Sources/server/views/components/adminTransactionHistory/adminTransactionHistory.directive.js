/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminTransactionHistory', function () {
            return {
                controller: 'adminTransactionHistoryController',
                templateUrl: '/components/adminTransactionHistory/adminTransactionHistory.html',
                controllerAs: 'adminTransactionHistoryController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
