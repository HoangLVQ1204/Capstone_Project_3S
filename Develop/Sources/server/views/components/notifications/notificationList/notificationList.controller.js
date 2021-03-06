/**
 * Created by hoanglvq on 11/13/15.
 */


function notificationListController($scope, config, dataService, notificationService, $rootScope){	
	console.log('notificationListController');
	// $rootScope.numberNewNoti = 0;
	$scope.pageNumbers = [];

	$scope.listNotifications = [];

	$scope.totalNotifications = 0;

	notificationService.getTotalNumberNotificationsServer()
	.then(function() {
		$scope.totalNotifications = notificationService.getTotalNumberNotifications();
		$scope.pageNumbers = notificationService.getPageNumbers();
		return notificationService.getListNotificationsServer();
	})	
	.then(function() {
		$scope.listNotifications = notificationService.getListNotifications();		
	});	

	$scope.selectPage = function(page) {
		if (page == notificationService.getCurrentPage()) return;
		notificationService.setCurrentPage(page);		
		$scope.pageNumbers = notificationService.getPageNumbers();
		notificationService.getListNotificationsServer()
		.then(function() {
			$scope.listNotifications = notificationService.getListNotifications();
		});
	};

	$scope.goLeft = function() {
		if (notificationService.getCurrentPage() > 0) {			
			$scope.selectPage(notificationService.getCurrentPage() - 1);
		}
	};	

	$scope.goRight = function() {
		if (notificationService.getCurrentPage() < $scope.pageNumbers.length - 1) {			
			$scope.selectPage(notificationService.getCurrentPage() + 1);
		}
	};

	$scope.passedTime = function(time) {
		// console.log('diffTime', time);
		var now = new Date();
		var date = new Date(time);
		var diff = Math.abs(now - date);	// in milliseconds		
		var days = Math.floor(diff / (1000 * 3600 * 24));
		diff %= (1000 * 3600 * 24);
		var hours = Math.floor(diff / (1000 * 3600));
		diff %= (1000 * 3600);
		var minutes = Math.floor(diff / (1000 * 60));
		// console.log('passedTime', diff, days, hours, minutes);
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
	};

	$scope.readNotification = function(index) {
		notificationService.readNotification(index)
		.then(function(data) {
			console.log('readNotification', data);
			if (data) {
				$rootScope.numberUnreadNoti = Math.max($rootScope.numberUnreadNoti - 1, 0);
			}
		});		
	};
}

notificationListController.$inject = ['$scope', 'config', 'dataService', 'notificationService', '$rootScope'];
angular.module('app').controller('notificationListController',notificationListController);


