angular.module('app')
    .directive('storeDashboard',function() {
        console.log("xxx");
        return {
            controller: 'storeDashboardController',
            templateUrl: '/components/storeDashboard/storeDashboard.html',
            controllerAs: 'storeDashboard',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    });




