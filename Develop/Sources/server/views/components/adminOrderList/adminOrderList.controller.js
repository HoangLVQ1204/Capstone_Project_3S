/**
 * Created by Hoang on 10/18/2015.
 */

function adminOrderListController($scope,$state, dataService, $filter, config, $rootScope) {


    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    $scope.orderStatusClass = {
        'Done': 'label-success',
        'Waiting': 'label-warning',
        //'Canceling': 'label-danger',
        'Delivering': 'label-success',
        'Picking up': 'label-default',
        'Bring to stock': 'label-default',
        'In stock': 'label-default',
        'Cancel': 'label-default',
    };

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'OrderID',
            value: 'orderid'
        },
        {
            option: 'Storename',
            value: 'store.name'
        },
        {
            option: 'Pickup Address',
            value: 'pickupaddress'
        },{
            option: 'Delivery Address',
            value: 'deliveryaddress'
        },{
            option: 'Status',
            value: 'orderstatus.statusname'
        }];

    $scope.dateOptions = [
        {
            option: 'Pickup Date',
            value: 'pickupdate'
        },
        {
            option: 'Delivery Date',
            value: 'deliverydate'
        }];

    $scope.selected = $scope.searchOptions[0];
    $scope.selectedDate = $scope.dateOptions[0];
    $scope.dateRange = '';

    getDataFromServer();

    function getDataFromServer(){
        $scope.orderList = [];
        dataService.getDataServer(config.baseURI + "/api/getAllOrder").then(function(response){
            $scope.orderList = response.data;
            //console.log($scope.orderList[0].customAddress)
            $scope.orderList.sort(function (a,b) {
                if (a.completedate < b.completedate) return -1;
                if (a.completedate > b.completedate) return 1;
                return 0;
            });
            $scope.displayedCollection = [].concat($scope.orderList);
        })
    }



    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();


    });

    $rootScope.$on("shipper:change:order:status", function(event,args){
        getDataFromServer();
    });
}

adminOrderListController.$inject = ['$scope','$state', 'dataService', '$filter', 'config','$rootScope'];
angular.module('app').controller('adminOrderListController',adminOrderListController);