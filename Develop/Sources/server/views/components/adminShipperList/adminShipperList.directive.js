/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminShipperListLayout',function(){
            return {
                templateUrl: '/components/adminShipperList/layout.html',
                replace: true,
                restrict: 'E',
                scope: false
            }
        })
        .directive('adminShipperList', function () {
            return {
                controller: 'adminShipperListController',
                templateUrl: '/components/adminShipperList/adminShipperList.html',
                controllerAs: 'adminShipperListController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
})(angular);
