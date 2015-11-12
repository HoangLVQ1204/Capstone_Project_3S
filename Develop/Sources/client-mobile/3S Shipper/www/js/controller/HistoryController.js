/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('HistoryCtrl', ['$scope', 'dataService', function ($scope, dataFactory) {
  $scope.historyorders = [];
  $scope.totalTask = 0;
  $scope.page = 1;
  getHistoryFromServer(1);
  $scope.loadMore = function(){
    getHistoryFromServer($scope.page);
  };

  function getHistoryFromServer(page) {
    var urlBase = config.hostServer + 'api/shipper/history?page='+page;
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        $scope.historyorders = $scope.historyorders.concat(rs.current);
        $scope.totalTask = parseInt(rs.total.total);
        $scope.page++;
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }
}]);
