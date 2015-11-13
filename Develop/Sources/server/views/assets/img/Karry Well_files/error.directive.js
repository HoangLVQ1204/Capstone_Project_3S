/**
 * Created by hoanglvq on 10/30/15.
 */
angular.module('app')
    .directive('error', function() {
        return {
            templateUrl: '/components/404/error.html',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })
