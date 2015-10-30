/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('HistoryCtrl', ['$scope', 'dataService', function ($scope, dataFactory) {
  $scope.historyorders = [];
  getHistoryFromServer();

  function getHistoryFromServer() {
    var urlBase = config.hostServer + 'api/history';
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        $scope.historyorders = rs;
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }
}]);
