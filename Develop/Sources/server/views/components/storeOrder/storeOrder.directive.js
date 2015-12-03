angular.module('app')
    .directive('storeOrder',function() {
        return {
            controller: 'storeOrderController',
            templateUrl: '/components/storeOrder/storeOrder.html',
            controllerAs: 'storeOrder',
            scope: false,
            //replace: true,
            restrict: 'E'
        }
    });




