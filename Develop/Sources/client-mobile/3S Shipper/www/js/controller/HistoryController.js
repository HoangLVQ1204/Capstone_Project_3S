/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('HistoryCtrl', ['$scope', 'dataService', '$localstorage', function ($scope, dataFactory, $localstorage) {
  $scope.historyorders = [];
  $scope.totalTask = 0;
  $scope.totalLoaded = 0;
  $scope.page = 1;
  getHistoryFromServer(1);
  $scope.loadMore = function(){
    getHistoryFromServer($scope.page);
  };

  function getHistoryFromServer(page) {
    var urlBase = config.hostServer + 'api/shipper/history?page='+page;
    dataFactory.getDataServer(urlBase)
      .then(function (rs) {
        rs = rs.data;
        if($scope.historyorders.length > 0)
        if(rs.current[0].date == $scope.historyorders[$scope.historyorders.length - 1].date){
          $scope.historyorders[$scope.historyorders.length - 1].taskOfDate = $scope.historyorders[$scope.historyorders.length - 1].taskOfDate.concat(rs.current[0].taskOfDate);
          rs.current.splice(0, 1);
        }
        $scope.historyorders = $scope.historyorders.concat(rs.current);
        $scope.totalTask = parseInt(rs.total.total);
        $scope.totalLoaded = 0;
        $scope.page++;
        $scope.historyorders.map(function(it){
          $scope.totalLoaded += it.taskOfDate.length;
        });
      });
  }

  //testLocal();
  function testLocal(){
    $localstorage.set('history','local');
    var his = $localstorage.get('history','');
    alert(his);
  }
}]);
