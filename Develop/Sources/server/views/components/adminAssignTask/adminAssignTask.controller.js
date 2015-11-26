/**
 * Created by Hoang on 10/18/2015.
 */
function adminAssignTaskController($scope,$state, $http, authService, config, dataService) {


    $scope.tasksList = [];//all task of shipper
    $scope.tasksList = [];//all task of shipper
    $scope.shipperList = [];
    $scope.orderList = [];
    $scope.taskList = [];
    $scope.oldTasks = [];//old Task
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

    dataService.getDataServer(config.baseURI + "/api/shipper/getAllShipper").then(function(response){
        $scope.shipperList = response.data;
        $scope.displayedShipperCollection = [].concat($scope.tasksList);
        //console.log($scope.displayedShipperCollection)
        //console.log(1);
        //console.log(response);
    }).then(function () {
        dataService.getDataServer(config.baseURI + "/api/shipper/getAllShipperWithTask").then(function(response){
            $scope.tasksList = response.data;
            getOldTask();
            $scope.shipperList.map(function (shipper) {
                var result = $.grep($scope.tasksList, function(e){ return e.username == shipper.username; });
                shipper['tasks'] = [];
                if (result.length==0) $scope.tasksList.push(shipper);

            })
            $scope.displayedShipperCollection = [].concat($scope.tasksList);
            //console.log($scope.displayedShipperCollection)
            //console.log(1);

        }).then(function () {
            dataService.getDataServer(config.baseURI + "/api/getUserGetIssue").then(function(response){
                $scope.listUserHasIssue = response.data;
                $scope.tasksList.map(function (shipper) {
                    var shipperHasIssue = $.grep($scope.listUserHasIssue, function(e){ return e.sender == shipper.username;});
                    if (shipperHasIssue.length > 0) shipper['hasIssue'] = true;
                    else shipper['hasIssue'] = false;
                });
                //console.log( $scope.tasksList);
            });
            //$scope.moveAllProcessingTask($scope.originShipperID);
        })
    })


    dataService.getDataServer(config.baseURI + "/api/shipper/getAllOrderToAssignTask").then(function(response){
        $scope.orderList = response.data;
        $scope.displayedOrderCollection = [].concat($scope.orderList);
        //console.log($scope.orderList);
    });




    $scope.assignTask = function () {
        dataService.putDataServer(config.baseURI + "/api/shipper/updateTaskForShipper", $scope.tasksList).then(function success(response){
            var data = new Object();
            data.verticalEdge='right';
            data.horizontalEdge='bottom';
            data.theme="theme-inverse";
            //data.sticky="true";
            $.notific8($("#sms-success").val(), data);
            $scope.tasksList.map(function (shipper) {
                var i= 0, n=shipper.tasks.length;

                while(i<n) {
                    var task = shipper.tasks[i];
                    var oldTask = $.grep($scope.oldTasks, function(e){ return e.taskid ==  task.taskid;});
                    //console.log(oldTask)
                    if (task.statusid == 4 && oldTask.length > 0 && task.shipperid!=oldTask[0].shipperid) {
                        var indexTask = shipper.tasks.indexOf(task);
                        shipper.tasks.splice(indexTask, 1);
                        n--;
                    }
                    else if (task.statusid == 1) {
                        task['taskstatus'] = new Object();
                        task['taskstatus']['statusname'] = 'Inactive';
                        i++;
                    } else i++;
                }
            })
            getOldTask();

                //$http.put(config.baseURI + "/api/updateTaskNoShipper", $scope.taskNoShipper);

        }) .catch( function (error) {
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

        if ($scope.pickedShipper.hasIssue){
            var data = new Object();
            data.verticalEdge='right';
            data.horizontalEdge='bottom';
            data.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail-assign").val(), data);
            return;
        }
        var index = $scope.orderList.indexOf(order);
        if (index !== -1) {
            $scope.orderList.splice(index, 1);
            if (order.taskid == null){
                order['shipperid'] = $scope.pickedShipper.username;
                order['orderid'] = order.order.orderid;
                order['adminid'] = currentUser.username;
                order['statusid'] = 1;
                //order['taskstatus'] = new Object();
                //order['taskstatus']['statusname'] = 'Inactive';
                if (order.order.orderstatus == 1 ) order['typeid'] = 1
                  else order['typeid'] = 2;
                order['taskdate'] = new Date(Date.now());
            }
            else {
                //order['prevshipperid'] = order.shipperid;
                //console.log(order['prevshipperid']);
                var indexTask = $scope.taskNoShipper.indexOf(order.taskid);
                $scope.taskNoShipper.splice(indexTask, 1);
                order['shipperid'] = $scope.pickedShipper.username;
            }
            $scope.taskList.unshift(order);
            //console.log($scope.taskNoShipper);
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

            //console.log($scope.orderList);

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
    //FUNCTION move processing task away shipper has issue
    //-----------------------------------
    $scope.moveAllProcessingTask = function(shipperid){
        var originShipper = $.grep($scope.tasksList, function(e){ return e.username ==  shipperid;});
        $scope.orderList = $scope.orderList.concat(originShipper[0].tasks.slice(0,originShipper[0].tasks.length));
        originShipper[0].tasks.splice(0,originShipper[0].tasks.length);
        //originShipper[0].tasks = [];
        $scope.orderList.map(function (shipper) {
            shipper.shipperid = null;
        })
        //console.log(originShipper[0].tasks);
        //console.log($scope.orderList);
    }

    //----------------------------------
    //FUNCTION move order away shipper has issue
    //-----------------------------------
    $scope.moveAllOrderToShipper = function(shipperid){
        if ($scope.pickedShipper == null) return;

        if ($scope.pickedShipper.hasIssue){
            var data = new Object();
            data.verticalEdge='right';
            data.horizontalEdge='bottom';
            data.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail-assign").val(), data);
            return;
        }
        //var originShipper = $.grep($scope.tasksList, function(e){ return e.username ==  shipperid;});
        for(i=0;i<$scope.orderList.length;i++)
        {
            $scope.orderList[i].shipperid = $scope.pickedShipper.username;
            $scope.pickedShipper.tasks.push($scope.orderList[i]);
            //console.log($scope.orderList[i]);
        }
        //$scope.$parent.$apply();
        $scope.orderList.splice(0,$scope.orderList.length);
        //$scope.orderList = [];
        //console.log(originShipper[0].tasks);
        console.log($scope.tasksList);
    }

    //----------------------------------
    //FUNCTION move order away shipper has issue
    //-----------------------------------
    $scope.goInbox = function(){
        var issue = $.grep($scope.listUserHasIssue, function(e){ return e.sender ==  $scope.originShipperID;});
        //console.log(issue[0])
        $state.go('admin.issueBox.content',{issueid: issue[0].issueid});
    }

    //----------------------------------
    //FUNCTION move order away shipper has issue
    //-----------------------------------
    function getOldTask(){
        $scope.oldTasks = [];
        $scope.tasksList.map(function (shipper) {
            shipper.tasks.map(function (oldtask) {
                if (oldtask.statusid != null){
                    var task = new Object();
                    task['shipperid'] = shipper.username;
                    task['taskid'] = oldtask.taskid;
                    $scope.oldTasks.push(task);
                }
            })

        })
    }
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });




}

adminAssignTaskController.$inject = ['$scope','$state', '$http', 'authService', 'config', 'dataService'];
angular.module('app').controller('adminAssignTaskController',adminAssignTaskController);