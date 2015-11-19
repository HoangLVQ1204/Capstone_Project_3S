/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('storeOrderList', function () {
            return {
                controller: 'storeOrderListController',
                templateUrl: '/components/storeOrderList/storeOrderList.html',
                controllerAs: 'storeOrderListController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        
})(angular);
