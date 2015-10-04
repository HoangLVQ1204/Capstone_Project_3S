/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('SignInCtrl', function ($scope, $state) {

  $scope.signIn = function(shipper){
    console.log('Sign-In', shipper);
    $state.go('app.orderlist');
  }
});
