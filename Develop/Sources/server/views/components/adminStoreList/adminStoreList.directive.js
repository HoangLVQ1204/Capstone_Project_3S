/**
 * Created by Hoang on 10/18/2015.
 */

angular.module('app')
    .directive('adminStoreList', function() {
        return {
            controller: 'adminStoreListController',
            templateUrl: '/components/adminStoreList/adminStoreList.html',
            controllerAs: 'adminStoreListController',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })
