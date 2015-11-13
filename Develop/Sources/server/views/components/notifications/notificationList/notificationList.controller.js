/**
 * Created by hoanglvq on 11/13/15.
 */


// RUN ORDER: controller => link function   
function notificationListController($scope){       
	// $scope.listNotifications = [	
 //       	{
 //       		type: 'issue',
 //                     title: 'big issue',
 //       		content: 'This is big issue',
 //       		url: 'bigissue',
 //                     createddate: 'date 1'
 //       	},
 //       	{
 //       		type: 'issue',
 //                     title: 'small issue',
 //       		content: 'This is small issue',
 //       		url: 'smallissue',
 //                     createddate: 'date 2'
 //       	},
 //       	{
 //       		type: 'info',
 //                     title: 'new info',
 //       		content: 'This is an info',
 //       		url: 'info',
 //                     createddate: 'date 3'
 //       	}
	// ];
}

notificationListController.$inject = ['$scope'];
angular.module('app').controller('notificationListController',notificationListController);


