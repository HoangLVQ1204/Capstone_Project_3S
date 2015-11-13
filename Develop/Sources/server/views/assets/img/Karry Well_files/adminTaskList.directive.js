/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminTaskList', function () {
            return {
                controller: 'adminTaskListController',
                templateUrl: '/components/adminTaskList/adminTaskList.html',
                controllerAs: 'adminTaskListController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
