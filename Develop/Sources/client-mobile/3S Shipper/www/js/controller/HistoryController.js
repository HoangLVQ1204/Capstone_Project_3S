/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('HistoryCtrl', ['$scope', 'dataService', function ($scope, dataFactory) {
  $scope.historyorders = [
    {
      id: 1,
      code: 'ORD001-001',
      statusid: 'Done',
      date: '15/10/2015',
      fee: '20.000',
      COD: '300.000'
    }, {
      id: 2,
      code: 'ORD002-202',
      statusid: 'Done',
      date: '14/10/2015',
      fee: '20.000',
      COD: '300.000'
    }, {
      id: 3,
      code: 'ORD888-222',
      statusid: 'Cancel',
      date: '15/10/2015',
      fee: '20.000',
      COD: '300.000'
    }, {
      id: 4,
      code: 'ORD999-000',
      statusid: 'Cancel',
      date: '14/10/2015',
      fee: '20.000',
      COD: '300.000'
    }
  ];

  getHistoryFromServer();

  function getHistoryFromServer() {
    var urlBase = 'http://localhost:3000/api/history';
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        $scope.historyorders = rs;
        //alert(111);
        console.log(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }
}]);
