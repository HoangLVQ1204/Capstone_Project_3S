/**
 * Created by hoanglvq on 10/19/15.
 */
angular.module('app')
    .directive('login', function() {
        return {
            controller: 'loginController',
            templateUrl: '/components/login/login.html',
            controllerAs: 'login',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })
