/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state,dataService, $http){
    //$scope.map= true;
    $scope.tableColumn =['OrderID','Delivery Address', 'Customer','Customer Name','Status']

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'OrderID',
            value: 'orderid'
        },{
            option: 'Delivery Address',
            value: 'deliveryaddress'
        },
        {
            option: 'Cusotmer',
            value: 'recipientname'
        },
        {
            option: 'Customer Phone',
            value: 'recipientphone'
        },
        {
            option: 'Status',
            value: 'statusname'
        }
    ];
    $scope.ordersWaiting =[];
    $scope.selected =$scope.searchOptions[0];
    $scope.dateRange = null;
    getDataFromServer();
    //postDataToServer();


   // $scope.displayedCollection = [].concat($scope.ordersWaiting);

    function getDataFromServer() {
        var urlBase = 'http://localhost:3000/orders';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.ordersWaiting = rs['Waiting'];
                $scope.orderCarring = rs['Carrying'];
                $scope.displayedCollection = [].concat($scope.ordersWaiting);

            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }

    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });

}


storeDashboardController.$inject = ['$scope','$state','dataService','$http'];

angular.module('app').controller('storeDashboardController',storeDashboardController);

