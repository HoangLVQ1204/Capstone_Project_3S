/**
 * Created by hoanglvq on 11/13/15.
 */


// RUN ORDER: controller => link function   
function notificationListController($scope){    
	$scope.notificationsPerPage = 20;   
	$scope.pageNumbers = [
		{
			id: 1,
			active: true
		},
		{
			id: 2,
			active: false
		},
		{
			id: 3,
			active: false
		}
	];

	$scope.selectPage = function(item) {
		$scope.pageNumbers.forEach(function(e) {
			if (e.id == item.id) e.active = true;
			else e.active = false;
		});
	};

	// $scope.listNotifications = [	
 //       	{
 //       		type: 'issue',
 //            title: 'big issue',
 //       		content: 'This is big issue',
 //       		url: 'bigissue',
 //            createddate: 'date 1'
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


