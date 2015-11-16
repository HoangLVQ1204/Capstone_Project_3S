/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminUserDetail', function () {
            return {
                controller: 'adminUserDetailController',
                templateUrl: '/components/adminUserDetail/adminUserDetail.html',
                controllerAs: 'adminUserDetailController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
