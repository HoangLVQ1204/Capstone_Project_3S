/**
 * Created by Hoang on 10/18/2015.
 */
function adminAssignTaskController($scope,$state, $http, $filter) {

    $scope.shipperList = [];
    $scope.orderList = [];
    $scope.taskList = [];
    $scope.dateChoose = false
    $scope.displayedTaskCollection = [].concat($scope.taskList);
    $scope.searchShipperOptions = [
        {
            option: 'All',
            value: ''
        },{
            option: 'ShipperID',
            value: 'shipperid'
        },{
            option: 'Name',
            value: 'name'
        }];
    $scope.searchOrderOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'OrderID',
            value: 'orderid'
        },{
            option: 'Pickup Address',
            value: 'pickupaddress'
        },{
            option: 'Delivery Address',
            value: 'deliveryaddress'
        },{
            option: 'Status',
            value: 'orderstatus.statusname'
        }];
    $scope.selectedShipper =$scope.searchShipperOptions[0];
    $scope.selectedOrder =$scope.searchOrderOptions[0];
    $scope.dateRange = null;


    $http.get("http://localhost:3000/api/shipper/getAllShipperWithTask").success(function(response){
        $scope.shipperList = response;
        $scope.displayedShipperCollection = [].concat($scope.shipperList);
        //console.log(1);
        //console.log(response);
    })

    $http.get("http://localhost:3000/api/shipper/getAllOrderToAssignTask").success(function(response){
        $scope.orderList = response;
        $scope.displayedOrderCollection = [].concat($scope.orderList);
    })


    $scope.assignTask = function () {
        console.log($scope.xxx);
    }

    $scope.pickOrder = function (order) {
        var index = $scope.orderList.indexOf(order);
        if (index !== -1) {
            $scope.orderList.splice(index, 1);
            $scope.taskList.push(order);
            $scope.taskList.sort(compare);
        }
    }

    function compare(a,b) {
        if (a.orderid < b.orderid)
            return -1;
        if (a.orderid > b.orderid)
            return 1;
        return 0;
    }

    $scope.pickTask = function (order) {
        var index = $scope.taskList.indexOf(order);
        if (index !== -1) {
            $scope.taskList.splice(index, 1);
            $scope.orderList.push(order);
            $scope.orderList.sort(compare);
        }
    }

    $scope.pickShipper = function (shipper) {
        $scope.taskList = shipper.shipper;
        //console.log(shipper);
        //console.log(shipper);
    }
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });




}

adminAssignTaskController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('adminAssignTaskController',adminAssignTaskController);