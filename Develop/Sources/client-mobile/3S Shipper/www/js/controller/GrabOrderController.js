/**
 * Created by Nguyen Van Quyen on 11/4/2015.
 */

app.controller('GrabCtrl', ['$scope', '$ionicLoading', '$timeout', function ($scope, $ionicLoading, $timeout) {

  //20s
  $scope.counter = 20;
  $scope.onTimeout = function(){
    $scope.counter--;
    mytimeout = $timeout($scope.onTimeout,1000);
    if ($scope.counter == 0) {
      $scope.stop();
    }
  };
  var mytimeout = $timeout($scope.onTimeout,1000);

  $scope.stop = function(){
    $timeout.cancel(mytimeout);
  }
  //Ionic Loading
  $scope.show = function() {
    $ionicLoading.show({
      templateUrl: 'loading.html',
      scope: $scope,
      duration: 20000
    });
  };
  $scope.show();
  $scope.hide = function(){
    $ionicLoading.hide();
  };

}]);
