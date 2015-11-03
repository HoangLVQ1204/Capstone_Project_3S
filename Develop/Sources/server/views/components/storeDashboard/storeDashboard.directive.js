(function (ng) {
    angular.module('app')
        .directive('layout',function(){
            return {
                templateUrl: '/components/storeDashboard/layout.html',
                replace: true,
                restrict: 'E',
                scope: false
            }
        })
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



