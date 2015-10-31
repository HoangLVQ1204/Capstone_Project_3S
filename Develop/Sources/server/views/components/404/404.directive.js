/**
 * Created by hoanglvq on 10/30/15.
 */
angular.module('app')
    .directive('errorPage', function() {
        return {
            templateUrl: '/components/404/404.html',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })
