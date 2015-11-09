/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */

app.controller('SignInCtrl', ['$scope','$state', '$ionicLoading', 'authService', 'socketShipper', function($scope,$state, $ionicLoading, authService, socketShipper){

  var showError = function(error){
    $scope.showUserError = true;
    $scope.errorMessage = error.message;
  };
  $scope.user = {};
  $scope.submitFrm = function() {
    $ionicLoading.show({
      //duration: 500,
      noBackdrop: false,
      template: '<ion-spinner icon="android" class="custom-icon"/>'
    });
    authService.signIn($scope.user)
      .then(function(){
        if(authService.isRightRole(roles.shipper)){
          //TODO
          socketShipper.registerSocket();
          $state.go('app.tasks');
          $ionicLoading.hide();
        }
      })
      .catch(function(error){
        $ionicLoading.hide();
        showError({
          message: 'Username or Password is invalid'
        });
      })
  }

  $scope.logOut = function() {
    $ionicLoading.show({
      duration: 200,
      noBackdrop: false,
      template: '<ion-spinner icon="android" class="custom-icon"/>'
    });
    authService.signOut();
    $state.go('sign-in');
  }

}]);
