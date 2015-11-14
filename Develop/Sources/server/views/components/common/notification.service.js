





function notificationService($q,$http,authService){        

	var listNotifications = [];
    var api = {};

    api.getTotalNumberOfNotifications = function() {
		// GET api/notification/total    	
    };

    api.getNotificationsInPage = function(page) {
    	// GET api/notification
    };

    api.addNotification = function(notification) {

    };

    return api;
}

notificationService.$inject = ['$q','$http','authService'];

angular.module('app').factory('notificationService', notificationService);