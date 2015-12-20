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
    if(typeof $scope.user === "undefined" ||  typeof $scope.user.username === "undefined" || typeof $scope.user.password === "undefined") {
      $ionicLoading.hide();
      showError({
        message: 'Username and Password cannot be blank'
      });
    } else {
      console.log('sigincontroller:24');
      authService.signIn($scope.user)
        .then(function(res){
          if (typeof res == "undefined") {
            $ionicLoading.hide();
            showError({
              message: 'Your network connection failed. Please check your network connection and try again'
            });
          } else {
            authService.saveToken(res.data.token);
            //check role !shipper
            if (!authService.isRightRole(roles.shipper)) {
              $ionicLoading.hide();
              authService.signOut();
              showError({
                message: 'Username or Password is invalid. Try again.'
              });
            } else {
              socketService.connect()
              .then(function() {
                socketShipper.initHandlers();
                return socketService.authenSocket();
              })
              .then(function(){
                socketShipper.registerSocket();
                $state.go('app.tasks');
                //$ionicLoading.hide();
              });
            }
          }
        })
        .catch(function(error){
          console.log('SigninController:52 error', error);
          $ionicLoading.hide();
          showError({
            message: 'Username or Password is invalid'
          });
        })
    }


  };

  $scope.logOut = function() {
    $ionicLoading.show({
      duration: 200,
      noBackdrop: false,
      template: '<ion-spinner icon="bubbles" class="spinner-balanced"/>'
    });

    authService.signOut();
    socketService.disconnect();
    $state.go('sign-in');
  }

}]);
