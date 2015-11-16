/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminStoreDetail', function () {
            return {
                controller: 'adminStoreDetailController',
                templateUrl: '/components/adminStoreDetail/adminStoreDetail.html',
                controllerAs: 'adminStoreDetailController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
