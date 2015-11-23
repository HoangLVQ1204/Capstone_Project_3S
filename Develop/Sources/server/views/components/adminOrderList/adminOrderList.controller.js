/**
 * Created by Hoang on 10/18/2015.
 */

function adminOrderListController($scope,$state, $http, $filter, config) {

    $scope.orderList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

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

    $http.get(config.baseURI + "/api/getAllOrder").success(function(response){
        $scope.orderList = response;
        $scope.orderList.sort(function (a,b) {
            if (a.completedate < b.completedate) return -1;
            if (a.completedate > b.completedate) return 1;
            return 0;
        });
        $scope.displayedCollection = [].concat($scope.orderList);
        console.log(response);
    })

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();


    });


}

adminOrderListController.$inject = ['$scope','$state', '$http', '$filter', 'config'];
angular.module('app').controller('adminOrderListController',adminOrderListController);