/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminAssignTaskProcessing', function () {
            return {
                controller: 'adminAssignTaskProcessingController',
                templateUrl: '/components/adminAssignTaskProcessing/adminAssignTaskProcessing.html',
                controllerAs: 'adminAssignTaskProcessingController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })


})(angular);
