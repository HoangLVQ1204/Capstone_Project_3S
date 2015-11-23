/**
 * Created by KhanhKC on 19/11/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminReport', function () {
            return {
                controller: 'adminReportController',
                templateUrl: '/components/adminReport/adminReport.html',
                controllerAs: 'adminReportController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
