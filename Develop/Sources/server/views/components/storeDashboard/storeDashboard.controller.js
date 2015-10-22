/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state){


    $scope.$watch('$viewContentLoaded', function(event) {

        caplet();

    });

    //getDataFromServer();
    //
    //function getDataFromServer() {
    //    var urlBase = 'http://localhost:3000/orders';
    //    dataService.getDataServer(urlBase)
    //        .success(function (rs) {
    //            $scope.ordersWaiting = rs['Waiting'];
    //            $scope.orderCarring = rs['Carrying'];
    //            console.log(rs);
    //        })
    //        .error(function (error) {
    //            console.log('Unable to load customer data: ' + error);
    //        });
    //}

}


storeDashboardController.$inject = ['$scope','$state'];

angular.module('app').controller('storeDashboardController',storeDashboardController);

