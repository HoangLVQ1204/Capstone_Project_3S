/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state,dataService, $http){
    $scope.tableColumn =['OrderID','Delivery Address', 'Customer','Customer Name','Status'];

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
    $scope.selected =$scope.searchOptions[0];
    $scope.dateRange = null;
    getDataFromServer();
    //postDataToServer();

    function getDataFromServer() {
        var urlBase = 'http://localhost:3000/orders';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.totalOrder = rs['Draff'].length + rs['Done'].length + rs['Issue'].length + rs['Inprocess'].length ;
                $scope.orderToday;

                $scope.ordersDraff = rs['Draff'];
                $scope.orderIssue = rs['Issue'];
                $scope.orderInprocess= rs['Inprocess'];
                $scope.orderDone= rs['Done'];
                $scope.displayedCollectionDraff = [].concat($scope.ordersDraff);
                $scope.displayedCollectionIssue = [].concat($scope.orderIssue);
                $scope.displayedCollectionInprocess = [].concat($scope.orderInprocess);
                $scope.displayedCollectionDone = [].concat($scope.orderDone);

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

