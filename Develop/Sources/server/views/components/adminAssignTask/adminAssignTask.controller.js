/**
 * Created by Hoang on 10/18/2015.
 */
function adminAssignTaskController($scope,$state, $http, authService, config) {


    $scope.tasksList = [];
    $scope.orderList = [];
    $scope.taskList = [];
    $scope.taskNoShipper = [];
    $scope.pickedShipper = null;
    var currentUser = authService.getCurrentInfoUser();
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
    $scope.dateNow = new Date();
    //console.log("URL:"+ config.baseURI + "/api/shipper/getAllShipperWithTask");

    $http.get(config.baseURI + "/api/shipper/getAllShipperWithTask").success(function(response){
        $scope.tasksList = response;
        $scope.displayedShipperCollection = [].concat($scope.tasksList);
        console.log($scope.displayedShipperCollection)
        //console.log(1);
        //console.log(response);
    })

    $http.get(config.baseURI + "/api/shipper/getAllOrderToAssignTask").success(function(response){
        $scope.orderList = response;
        $scope.displayedOrderCollection = [].concat($scope.orderList);
    })


    $scope.assignTask = function () {
        $http.post(config.baseURI + "/api/shipper/updateTaskForShipper", $scope.tasksList).then(function success(response){
            var data = new Object();
            data.verticalEdge='right';
            data.horizontalEdge='bottom';
            data.theme="theme-inverse";
            //data.sticky="true";
            $.notific8($("#sms-success").val(), data);
            $scope.tasksList.map(function (shipper) {
                shipper.tasks.map(function (task) {
                    if (task.statusid == 4 && task.shipperid != task.prevshipperid && task.prevshipperid!=null) {
                        task.statusid = 1;
                        task.taskstatus.statusname = "NotActive";
                    }
                })
            })
                $http.put(config.baseURI + "/api/updateTaskNoShipper", $scope.taskNoShipper);

        }, function (error) {
            var data = new Object();
            data.verticalEdge='right';
            data.horizontalEdge='bottom';
            data.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail").val(), data);
        })
    }

    $scope.pickOrder = function (order) {
        //console.log(order)
        if ($scope.pickedShipper == null) return;
        var index = $scope.orderList.indexOf(order);
        if (index !== -1) {
            $scope.orderList.splice(index, 1);
            if (order.taskid == null){
                order['shipperid'] = $scope.pickedShipper.username;
                order['orderid'] = order.order.orderid;
                order['adminid'] = currentUser.username;
                order['statusid'] = 1;
                order['taskstatus'] = new Object();
                order['taskstatus']['statusname'] = 'NotActive';
                if (order.order.orderstatus == 1 ) order['typeid'] = 1
                  else order['typeid'] = 2;
                order['taskdate'] = new Date();
            }
            else {
                //order['prevshipperid'] = order.shipperid;
                //console.log(order['prevshipperid']);
                var indexTask = $scope.taskNoShipper.indexOf(order.taskid);
                $scope.taskNoShipper.splice(indexTask, 1);
                order['shipperid'] = $scope.pickedShipper.username;
            }
            $scope.taskList.unshift(order);
            console.log($scope.taskNoShipper);
            //$scope.taskList.sort(compare);
        }
    }


    $scope.pickTask = function (task) {
        var index = $scope.taskList.indexOf(task);
        //console.log(task);
        if (index !== -1) {
            //$('#' + order.orderid).parent().addClass('fail-task');
            $scope.taskList.splice(index, 1);
            task['prevshipperid'] = task['shipperid'];
            task['shipperid'] = null;
            $scope.taskNoShipper.push(task.taskid);
            $scope.orderList.unshift(task);

            //$scope.orderList.sort(compare);+

        }
    }

    $scope.pickShipper = function (shipper) {
        //console.log(shipper);
        if (shipper.isSelected) {
            $scope.taskList = shipper.tasks;
            $scope.pickedShipper = shipper;
        }
        else {
            $scope.taskList=[];
            $scope.pickedShipper = null;
        }
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

adminAssignTaskController.$inject = ['$scope','$state', '$http', 'authService', 'config'];
angular.module('app').controller('adminAssignTaskController',adminAssignTaskController);