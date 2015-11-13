/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminAddShipper', function () {
            return {
                controller: 'adminAddShipperController',
                templateUrl: '/components/adminAddShipper/adminAddShipper.html',
                controllerAs: 'adminAddShipperController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
