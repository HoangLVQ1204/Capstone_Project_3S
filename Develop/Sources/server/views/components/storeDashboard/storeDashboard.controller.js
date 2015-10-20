/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state, dataService){

    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });

    getDataFromServer();

    function getDataFromServer() {
        var urlBase = 'http://localhost:3000/api/history';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.orders = rs;
                alert(111);
                console.log(rs);
            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }
}

storeDashboardController.$inject = ['$scope','$state','dataService'];
angular.module('app').controller('storeDashboardController',storeDashboardController);

