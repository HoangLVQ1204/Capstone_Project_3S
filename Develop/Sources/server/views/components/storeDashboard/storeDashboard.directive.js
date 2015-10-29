(function (ng) {
angular.module('app')
    .directive('storeDashboard',function() {

        return {
            controller: 'storeDashboardController',
            templateUrl: '/components/storeDashboard/storeDashboard.html',
            controllerAs: 'storeDashboard',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })

})(angular);



