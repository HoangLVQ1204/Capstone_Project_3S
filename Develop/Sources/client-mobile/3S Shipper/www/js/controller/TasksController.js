/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$scope', 'dataFactory', function($scope, dataFactory) {

  $scope.orders = [];
  var urlBase = 'http://localhost:3000/api/tasks';
  var data = {};
  getDataFromServer();

  function getDataFromServer() {
    dataFactory.getDataServer(urlBase, data)
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
