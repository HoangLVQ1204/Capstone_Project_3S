/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */

app.controller('SignInCtrl', ['$scope','$state','authService', function($scope,$state,authService){

  var showError = function(error){
    $scope.showUserError = true;
    $scope.errorMessage = error.message;
  };

  $scope.user = {};
  $scope.submitFrm = function() {
    authService.signIn($scope.user)
      .then(function(){
        if(authService.isRightRole(roles.shipper)){
          //TODO
          //socketShipper.registerSocket();
          $state.go('app.tasks');
        }
      })
      .catch(function(error){
        showError({
          message: 'Username or Password is invalid'
        });
      })
  }

}]);
