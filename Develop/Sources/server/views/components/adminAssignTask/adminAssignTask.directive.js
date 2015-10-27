/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminAssignTask', function () {
            return {
                controller: 'adminAssignTaskController',
                templateUrl: '/components/adminAssignTask/adminAssignTask.html',
                controllerAs: 'adminAssignTaskController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
