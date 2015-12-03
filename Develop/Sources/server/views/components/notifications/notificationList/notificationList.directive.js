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
            scope: {
                listNotifications: '='
            }
        }
    });

