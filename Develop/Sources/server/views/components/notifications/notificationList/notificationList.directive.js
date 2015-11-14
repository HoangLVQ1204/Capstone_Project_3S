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


// Notification List Demo [ will remove later ]
angular.module('app')
.config(function($stateProvider,$urlRouterProvider,config) {
    //$urlRouterProvider.otherwise('/mapdemo');

    $stateProvider
        .state('notificationListdemo',{
            url: '/notiListdemo',
            template: '<notification-list></notification-list>',
            controller: function($scope) {
                // $scope.listNotifications = [    
                //     {
                //         type: 'issue',
                //         title: 'big issue',
                //         content: 'This is big issue',
                //         url: '/notiListdemo',
                //         createddate: 'date 1'
                //     },
                //     {
                //         type: 'issue',
                //         title: 'small issue',
                //         content: 'This is small issue',
                //         url: '/notiListdemo',
                //         createddate: 'date 2'
                //     },
                //     {
                //         type: 'info',
                //         title: 'new info',
                //         content: 'This is an info',
                //         url: '/notiListdemo',
                //         createddate: 'date 3'
                //     }
                // ];
            }
        })
});

