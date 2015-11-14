/**
 * Created by hoanglvq on 11/13/15.
 */


// RUN ORDER: controller => link function   
function notificationController($scope){
	console.log($scope.notification);

	$scope.$watch('$viewContentLoaded', function(event) {
		caplet();
		$(".notific").on('click',function(){
			console.log(this);
			var nclick=$(this), data=nclick.data();
			data.verticalEdge=data.vertical || 'right';
			data.horizontalEdge=data.horizontal  || 'top';
			console.log('sms', $("#sms").val(), data);
			$.notific8($("#sms").val(), data)	;
		});                
    });
}

notificationController.$inject = ['$scope'];
angular.module('app').controller('notificationController',notificationController);


