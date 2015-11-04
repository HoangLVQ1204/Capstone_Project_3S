/**
 * Created by Kaka Hoang Huy on 11/1/2015.
 */

app.controller('ChangeStatusCtrl', ['$scope', function($scope) {

  //set Option Selected
  $scope.status = true;
  $scope.changeStatus = function(status){
    console.log('change',status);
  }
}]);
