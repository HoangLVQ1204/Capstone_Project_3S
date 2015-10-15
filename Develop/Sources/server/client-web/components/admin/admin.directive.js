angular.module('app')
    .directive('admin', function() {
        return {
            controller: 'adminController',
            templateUrl: '/components/admin/admin.html',
            controllerAs: 'admin',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })


