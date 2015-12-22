(function (ng) {
    angular.module('app')
        .directive('storeOrderDetailLayout',function(){
            return {
                templateUrl: '/components/storeOrderDetail/storeOrderDetailLayout.html',
                replace: true,
                restrict: 'E',
                scope: false
            }
        })
        .directive('storeOrderDetail',function() {
            return {
                controller: 'storeOrderDetailController',
                templateUrl: '/components/storeOrderDetail/storeOrderDetail.html',
                controllerAs: 'storeOrderDetail',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        
})(angular);



