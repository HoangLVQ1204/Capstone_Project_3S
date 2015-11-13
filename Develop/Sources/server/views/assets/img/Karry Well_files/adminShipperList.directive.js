/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
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
