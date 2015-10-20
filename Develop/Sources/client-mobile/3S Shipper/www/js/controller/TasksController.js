/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$scope', 'dataService', function($scope, dataFactory) {


  getDataFromServer();

  function getDataFromServer() {
    var urlBase = 'http://localhost:3000/api/tasks';
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        $scope.orders = rs;
        //alert(111);
        console.log(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

}]);
