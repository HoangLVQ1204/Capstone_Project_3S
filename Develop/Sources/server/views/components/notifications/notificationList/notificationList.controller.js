/**
 * Created by hoanglvq on 11/13/15.
 */


// RUN ORDER: controller => link function   
function notificationListController($scope){
	$scope.listNotifications = [	
       	{
       		type: 'issue',
       		content: 'This is big issue',
       		url: 'bigissue'
       	},
       	{
       		type: 'issue',
       		content: 'This is small issue',
       		url: 'smallissue'
       	},
       	{
       		type: 'info',
       		content: 'This is an info',
       		url: 'info'
       	}
	]
}

notificationListController.$inject = ['$scope'];
angular.module('app').controller('notificationListController',notificationListController);


