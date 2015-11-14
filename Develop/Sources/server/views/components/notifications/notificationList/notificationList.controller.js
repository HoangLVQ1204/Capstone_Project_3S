/**
 * Created by hoanglvq on 11/13/15.
 */


/*
	Helper functions
*/

function genPagination($scope) {
	$scope.pageNumbers = [];
	for (var i = 0; i < parseInt(($scope.totalNotifications + $scope.notificationsPerPage - 1) / $scope.notificationsPerPage); ++i) {
		$scope.pageNumbers.push(false);
	}
	if ($scope.pageNumbers.length) {
		$scope.pageNumbers[0] = true;
	}
}

function getPageOfNotifications(page, $scope, config, dataService) {
	var offset = page * $scope.notificationsPerPage;
	var limit = $scope.notificationsPerPage;
	var urlBase = config.baseURI + '/api/notifications?offset=' + offset + '&limit=' + limit;
	dataService.getDataServer(urlBase)
	.then(function(data) {
		// console.log('getPageOfNotifications', data.data);
		$scope.listNotifications = data.data;
	});
}

function notificationListController($scope, config, dataService){ 	
	$scope.notificationsPerPage = 7;   
	$scope.pageNumbers = [];
	$scope.listNotifications = [];
	$scope.currentPage = 0;
	$scope.totalNotifications = 0;

	var urlBase = config.baseURI + '/api/notifications/total';
	dataService.getDataServer(urlBase)
	.then(function(data) {
		// console.log('getDataServer', data);
		$scope.totalNotifications = data.data;
		genPagination($scope);
	});

	$scope.selectPage = function(page) {
		$scope.currentPage = page;
		for (var i = 0; i < $scope.pageNumbers.length; ++i) {
			if (i == page) $scope.pageNumbers[i] = true;
			else $scope.pageNumbers[i] = false;
		}
		getPageOfNotifications($scope.currentPage, $scope, config, dataService);
	};

	$scope.goLeft = function() {
		if ($scope.currentPage > 0) {			
			$scope.selectPage($scope.currentPage - 1);
		}
	};	

	$scope.goRight = function() {
		if ($scope.currentPage < $scope.pageNumbers.length - 1) {			
			$scope.selectPage($scope.currentPage + 1);
		}
	};

	$scope.passedTime = function(time) {
		// console.log('diffTime', time);
		var now = new Date();
		var date = new Date(time);
		var diff = Math.abs(now.getTime() - date.getTime());	// in milliseconds
		var days = Math.floor(diff / (1000 * 3600 * 24));
		var hours = Math.floor(diff / (1000 * 3600));
		var minutes = Math.floor(diff / 1000);
		if (days === 0) {
			if (hours === 0) {
				return minutes + ' minute' + (minutes > 1 ? 's' : '');
			} else {
				return hours + ' hour' + (hours > 1 ? 's' : '');
			}
		} else {
			return days + ' day' + (days > 1 ? 's' : '');
		}
		return diff;
	}

	$scope.readNotification = function(item) {
		item.isread = true;		
		var urlBase = config.baseURI + '/api/notifications/' + item.notificationid;		
		dataService.putDataServer(urlBase, item)
		.then(function(data) {
			console.log('readNotification', data);
		})
	};

	getPageOfNotifications(0, $scope, config, dataService);
}

notificationListController.$inject = ['$scope', 'config', 'dataService'];
angular.module('app').controller('notificationListController',notificationListController);


