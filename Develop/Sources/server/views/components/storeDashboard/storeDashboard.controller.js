/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state,dataService){


    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });

    getDataFromServer();

    function getDataFromServer() {
        var urlBase = 'http://localhost:3000/orders';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.ordersWaiting = rs['Waiting'];
                $scope.orderCarring = rs['Carrying'];
            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }
}


storeDashboardController.$inject = ['$scope','$state','dataService'];

angular.module('app').controller('storeDashboardController',storeDashboardController);

