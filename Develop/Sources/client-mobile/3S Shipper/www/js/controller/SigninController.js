/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */

app.controller('SignInCtrl', ['$scope','$state', '$ionicLoading', 'authService', 'socketShipper', 'socketService', function($scope,$state, $ionicLoading, authService, socketShipper, socketService){

  var showError = function(error){
    $scope.showUserError = true;
    $scope.errorMessage = error.message;
  };
  $scope.user = {};
  $scope.submitFrm = function() {
    $ionicLoading.show({
      //duration: 500,
      noBackdrop: false,
      template: '<ion-spinner icon="bubbles" class="spinner-balanced"/>'
    });
    authService.signIn($scope.user)
      .then(function(res){
        authService.saveToken(res.data.token);
        socketService.authenSocket()
          .then(function(){
            if(authService.isRightRole(roles.shipper)){
              socketShipper.registerSocket();
              $state.go('app.tasks');
              $ionicLoading.hide();
            }
          });
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
      template: '<ion-spinner icon="bubbles" class="spinner-balanced"/>'
    });
    socketShipper.updateStatusShipper();
    authService.signOut();
    $state.go('sign-in');
  }

}]);
