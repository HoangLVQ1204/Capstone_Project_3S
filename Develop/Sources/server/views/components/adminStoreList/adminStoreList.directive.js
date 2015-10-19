/**
 * Created by Hoang on 10/18/2015.
 */

angular.module('app')
    .directive('adminStoreList', function() {
        return {
            controller: 'adminStoreList',
            templateUrl: '/components/adminStoreList/adminStoreList.html',
            controllerAs: 'adminStoreList',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })
