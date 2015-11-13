/**
 * Created by hoanglvq on 11/13/15.
 */

angular.module('app')
    .directive('notificationList',function(){
        return {
            controller: 'notificationListController',
            templateUrl: '/components/notifications/notificationList/notificationList.html',
            controllerAs: 'notificationListCtrl',
            replace: true,
            restrict: 'E',
            scope: {}
        }
    });


// Notification List Demo [ will remove later ]
angular.module('app')
.config(function($stateProvider,$urlRouterProvider,config) {
    //$urlRouterProvider.otherwise('/mapdemo');

    $stateProvider
        .state('notificationListdemo',{
            url: '/notidemo',
            template: '<notification-list></notification-list>',
            controller: function($scope) {
            }
        })
});

