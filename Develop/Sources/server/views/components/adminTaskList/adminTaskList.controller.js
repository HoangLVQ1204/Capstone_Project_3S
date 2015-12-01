/**
 * Created by Hoang on 10/18/2015.
 */

function adminTaskListController($scope,$state, dataService, $filter, config, $rootScope) {




    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'ShipperID',
            value: 'shipperid'
        },{
            option: 'StoreID',
            value: 'order.storeid'
        },{
            option: 'OrderID',
            value: 'orderid'
        },{
            option: 'Order Status',
            value: 'orderstatus.statusname'
        },{
            option: 'Task Status',
            value: 'taskstatus.statusname'
        },{
            option: 'Type',
            value: 'tasktype.typename'
        }];
    $scope.selected = $scope.searchOptions[0];
    $scope.dateRange = null;
    $scope.taskStatusOptions =[];
    $scope.taskTypeOptions =[];

    getDataFromServer();

    function getDataFromServer(){
        $scope.taskList = [];
        dataService.getDataServer(config.baseURI + "/api/getAllTaskStatus").then(function(response){
            $scope.taskStatusOptions = response.data;
            $scope.taskStatusOptions.sort(ComparatorStatus);
            //console.log(response);
        }).then(function () {
            dataService.getDataServer(config.baseURI  + "/api/getTaskList").then(function(response){
                $scope.taskList = response.data;
                $scope.taskList.sort(dateSort);
            })
                .then(function () {
                    dataService.getDataServer(config.baseURI + "/api/getAllTaskType").then(function(response){
                        $scope.taskTypeOptions= response.data;
                        $scope.taskStatusOptions.sort(ComparatorType);
                        //console.log(response);
                    })
                        .then(function () {
                            //    $scope.selected =$scope.taskStatusOptions[0];
                            $scope.taskList.map(function (task) {
                                task.selectedStatus =  $scope.taskStatusOptions[task.taskstatus.statusid-1];
                                task.selectedType =  $scope.taskTypeOptions[task.tasktype.typeid-1];
                            });
                        })
                })
        })
        $scope.displayedCollection = [].concat($scope.taskList);
    }



    //----------------------------------
    //FUNCTION SHOW CONFIRM PAYMENT MODAL
    //-----------------------------------
    $scope.showConfirm = function (event, store){
        //alert(1);
        $scope.payFee = 0;
        $scope.payCoD = 0;
        $scope.selectedStore = store;
        event.preventDefault();
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
        var data = new Object();
        data.effect="md-flipVer";
        $("#md-effect-confirm").attr('class','modal fade').addClass(data.effect).modal('show');
        $("#inputValue").val(0);
        $scope.isValid = $('#inputValue').parsley( 'validate' );

    };

    function ComparatorStatus(a,b){
        if (a.statusid < b.statusid) return -1;
        if (a.statusid > b.statusid) return 1;
        return 0;
    };
    function ComparatorType(a,b){
        if (a.typeid < b.typeid) return -1;
        if (a.typeid > b.typeid) return 1;
        return 0;
    }


        //----------------------------------
    //FUNCTION GET ALL STATUS OF TASK
    //-----------------------------------
    //var getAllTaskStatus = function (){
    //    //alert(1);
    //     dataService.getDataServer(config.baseURI + "/api/getAllTaskStatus").success(function(response){
    //        $scope.taskStatusOptions= response;
    //        //response.map(function(status){
    //        //    var options = new Object();
    //        //    options.option = status.statusname;
    //        //})
    //        console.log($scope.taskList);
    //
    //    })
    //}
    //$scope.getAllTaskStatus = getAllTaskStatus;

    //----------------------------------
    //FUNCTION GET ALL TYPE OF TASK
    //-----------------------------------
    //var getAllTaskType = function (){
    //    ////console.log(11);
    //     dataService.getDataServer(config.baseURI + "/api/getAllTaskType").success(function(response){
    //        $scope.taskTypeOptions= response;
    //        //console.log(response);
    //    })
    //}

    //-----------------------------------
    //FUNCTION SAVE TASK STATE
    //-----------------------------------
    //$scope.saveTaskState = function (){
    //    ////console.log(11);
    //    $http.put(config.baseURI + "/api/updateAllTaskState", $scope.taskList).then(function success(response){
    //        smsData.theme="theme-inverse";
    //        $.notific8($("#sms-success").val(), smsData);
    //        //console.log(response);
    //    },function (error) {
    //        smsData.theme="danger";
    //        //data.sticky="true";
    //        $.notific8($("#sms-fail").val(), smsData);
    //        console.log(error)
    //    })
    //}


    var dateSort =  function(x, y){
        if (x.taskdate > y.taskdate) {
            return -1;
        }
        if (x.taskdate < y.taskdate) {
            return 1;
        }
        return 0;
    };
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

    $rootScope.$emit("shipper:change:order:status", function(event,args){
        getDataFromServer();
    });

    $rootScope.$emit("shipper:change:task:status", function(event,args){
        getDataFromServer();
    });
}

adminTaskListController.$inject = ['$scope','$state', 'dataService', '$filter', 'config', '$rootScope'];
angular.module('app').controller('adminTaskListController',adminTaskListController);