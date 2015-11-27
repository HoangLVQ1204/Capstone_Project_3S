/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('ProfileCtrl', ['$scope', 'authService', function ($scope, authService) {
  $scope.profile = {};
  $scope.error = '';
  authService.getProfileUser().then(function(rs){
    $scope.profile = rs.data;
    $scope.profile.avatar = config.hostServer + $scope.profile.avatar;
  },function(er){
    $scope.error = er.data;
  });
}]);
