/**
 * Created by Hoang on 10/6/2015.
 */
/**
 * Created by Hoang on 10/5/2015.
 */
angular.module('app')
    .directive('adminStoreList',function() {
        return {
            controller: 'adminStoreListController',
            templateUrl: '/components/adminStoreList/adminStoreList.html',
            controllerAs: 'adminStoreList',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    });

