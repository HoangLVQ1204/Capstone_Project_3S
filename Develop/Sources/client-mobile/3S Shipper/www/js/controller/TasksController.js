/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$scope', 'dataService', function($scope, dataFactory) {

  getDataFromServer();
  function getDataFromServer() {
    var urlBase = 'http://localhost:3000/api/tasks';
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
          $scope.pickupTasks = rs['Pickup'];
          $scope.badgeCountPick = rs['Pickup'].length;
        } else {
          $scope.pickupTasks = [];
          $scope.badgeCountPick = 0;
        }
        if (undefined !== rs['Ship'] && rs['Ship'].length) {
          $scope.shipTasks = rs['Ship'];
          $scope.badgeCountShip = rs['Ship'].length;
        } else {
          $scope.shipTasks = [];
          $scope.badgeCountShip = 0;
        }
        if (undefined !== rs['Express'] && rs['Express'].length) {
          $scope.expressTasks = rs['Express'];
          $scope.badgeCountExpress = rs['Express'].length;
        } else {
          $scope.expressTasks = [];
          $scope.badgeCountExpress = 0;
        }
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }
}]);
