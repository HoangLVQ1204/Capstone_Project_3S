/**
 * Created by hoanglvq on 11/13/15.
 */


// RUN ORDER: controller => link function   
function notificationController($scope){
	console.log($scope.notification);
}

notificationController.$inject = ['$scope'];
angular.module('app').controller('notificationController',notificationController);


