/**
 * Created by hoanglvq on 11/13/15.
 */

angular.module('app')
    .directive('notification',function(){
        return {
            controller: 'notificationController',
            templateUrl: '/components/notifications/notification/notification.html',
            controllerAs: 'notificationCtrl',
            replace: true,
            restrict: 'E',
            scope: {
                notification: '='
            }
        }
    });


// Notification Demo [ will remove later ]
angular.module('app')
.config(function($stateProvider,$urlRouterProvider,config) {
    //$urlRouterProvider.otherwise('/mapdemo');

    $stateProvider
        .state('notificationdemo',{
            url: '/notidemo',
            template: '<notification notification="notification"></notification>',
            controller: function($scope) {
                $scope.notification = {
                    type: 'issue',
                    title: 'big issue',
                    content: 'This is big issue',
                    url: 'bigissue',
                    createddate: 'date 1'
                };
            }
        })
});
