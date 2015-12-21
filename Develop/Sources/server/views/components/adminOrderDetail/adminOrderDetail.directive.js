/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminOrderDetailLayout',function(){
            return {
                templateUrl: '/components/adminOrderDetail/adminOrderDetailLayout.html',
                replace: true,
                restrict: 'E',
                scope: false
            }
        })
        .directive('adminOrderDetail', function () {
            return {
                controller: 'adminOrderDetailController',
                templateUrl: '/components/adminOrderDetail/adminOrderDetail.html',
                controllerAs: 'adminOrderDetailController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
