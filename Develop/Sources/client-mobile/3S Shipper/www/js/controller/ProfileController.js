/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('ProfileCtrl', ['$scope', 'dataService', function ($scope, dataService) {
  $scope.profile = {};
  getProfile();
  function getProfile() {
    var urlBase = config.hostServer + 'user/profile/' + getCurrentInfoUser().username;
    dataService.getDataServer(urlBase).then(function (rs) {
      $scope.profile = rs.data;
      $scope.profile.avatar = config.hostServer + $scope.profile.avatar;
    }, function (er) {
      $scope.error = er.data;
    });
  }
}]);
