/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$scope', 'dataService', 'mySharedService', function($scope, dataFactory, mySharedService) {

  if (undefined !== mySharedService.message && mySharedService.message !== '') {
    formatData(mySharedService.message);
  } else {
    console.log('save message sharing');
    getDataFromServer();
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is call API
   *
   * */
  function getDataFromServer() {
    var urlBase = 'http://localhost:3000/api/tasks';
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        mySharedService.prepForBroadcast(rs);
        formatData(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is format data respon from from server
   * @param: rs
   * */
  function formatData(rs) {
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
  }
}]);
