/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */

app.controller('controllerName', ['$scope', 'dataFactory', function($scope, dataFactory) {

    $scope.orders = [];
    var urlBase = 'http://localhost:3000/api/tasks';
    var data = {}; // data to send to server
    getDataFromServer();

    function getDataFromServer() {
        dataFactory.getDataServer(urlBase, data)
            .success(function (rs) {
                $scope.orders = rs;
                //do somethings else
            })
            .error(function (error) {
                //working with error (ex: display error)
                console.log('Unable to load customer data: ' + error);
            });
    }

}]);
