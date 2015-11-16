/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminAcceptStore', function () {
            return {
                controller: 'adminAcceptStoreController',
                templateUrl: '/components/adminAcceptStore/adminAcceptStore.html',
                controllerAs: 'adminAcceptStoreController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
