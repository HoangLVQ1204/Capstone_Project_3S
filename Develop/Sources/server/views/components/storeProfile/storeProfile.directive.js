/**
 * Created by KhanhKC on 19/11/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('storeProfile', function () {
            return {
                controller: 'storeProfileController',
                templateUrl: '/components/storeProfile/storeProfile.html',
                controllerAs: 'storeProfileController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
