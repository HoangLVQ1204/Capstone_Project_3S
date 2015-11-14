/**
 * Created by hoanglvq on 11/14/15.
 */

angular.module('app')
    .directive('storeRegister', function() {
        return {
            controller: 'storeRegisterController',
            templateUrl: '/components/storeRegister/storeRegister.html',
            controllerAs: 'storeRegister',
            replace: true,
            restrict: 'E',
            scope: {}
        }
    })