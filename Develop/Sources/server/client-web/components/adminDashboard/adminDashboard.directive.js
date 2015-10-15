/**
 * Created by Hoang on 10/5/2015.
 */
angular.module('app')
    .directive('adminDashboard',function() {
        return {
            controller: 'adminDashboardController',
            templateUrl: '/components/adminDashboard/adminDashboard.html',
            controllerAs: 'adminDashboard',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    });

