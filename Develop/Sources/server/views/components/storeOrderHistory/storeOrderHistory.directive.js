/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('storeOrderHistory', function () {
            return {
                controller: 'storeOrderHistoryController',
                templateUrl: '/components/storeOrderHistory/storeOrderHistory.html',
                controllerAs: 'storeOrderHistoryController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        
})(angular);
