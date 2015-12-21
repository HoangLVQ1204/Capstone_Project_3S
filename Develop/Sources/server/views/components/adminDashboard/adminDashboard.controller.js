/**
 * Created by hoanglvq on 9/22/15.
 */

function adminDashboardController($scope,$state,dataService, config, $rootScope, socketAdmin){

    //Option for drop down list
    $scope.searchOptionsInactive = [
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
            option: 'Type',
            value: 'tasktype.typename'
        }

    ];


    $scope.selectedInactive =$scope.searchOptionsInactive[0];
    $scope.selectedDone=$scope.searchOptionsInactive[0];
    $scope.selectedActive=$scope.searchOptionsInactive[0];
    $scope.selectedFail=$scope.searchOptionsInactive[0];

    $scope.dateRangeInactive = null;
    $scope.dateRangeActive = null;
    $scope.dateRangeDone = null;
    $scope.dateRangeFail = null;


    getDataFromServer();

    function getDataFromServer() {
        var urlBase = config.baseURI + "/api/getTaskList";
        $scope.onlineShipper = socketAdmin.listOnlineShipper.length;
        $scope.inactiveList = [];
        $scope.doneList = [];
        $scope.activeList = [];
        $scope.failList = [];
        $scope.shipperList = [];
        $scope.totalTaskToday = 0;
        $scope.totalDoneToday = 0;
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                //console.log(rs);
                rs.data.map(function (task) {
                     if (task.statusid == 1)  $scope.inactiveList.push(task);
                     if (task.statusid == 2 || task.statusid == 4)  $scope.activeList.push(task);
                     if (task.statusid == 3)  $scope.doneList.push(task);
                     if (task.statusid == 5)  $scope.failList.push(task);
                     if (dateCompare(new Date(task.taskdate), new Date(Date.now()))) {
                         if (task.statusid != 5) $scope.totalTaskToday++;
                         if (task.statusid == 3) $scope.totalDoneToday++;
                     }
                });
                    $scope.displayedInactiveList = [].concat($scope.inactiveList);
                    $scope.displayedActiveList = [].concat($scope.activeList);
                    $scope.displayedDoneList = [].concat($scope.doneList);
                    $scope.displayedFailList = [].concat($scope.failList);

            })

        var urlBaseTotal = config.baseURI + "/api/getTodayTotal";
        dataService.getDataServer(urlBaseTotal)
            .then(function (rs) {
                $scope.todayTotal = rs.data;
            })

        var urlBaseAllShipper = config.baseURI + "/api/shipper/getAllShipper";
        dataService.getDataServer(urlBaseAllShipper)
            .then(function (rs) {
                $scope.shipperList = rs.data;
                $scope.totalShipper = rs.data.length;
            })

    }

    var dateCompare = function (date1, date2) {
        return (date1.getDate() == date2.getDate()
                    && date1.getMonth() == date2.getMonth()
                    && date1.getFullYear() == date2.getFullYear())
    }


    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
        //$('#progressTask').find('.progress-bar').css({width: ($scope.totalDoneToday/$scope.totalTaskToday) + '%'});
    });

    var alertDelete = {
        "success": function () {
            var data = new Object();
            data.verticalEdge = 'right';
            data.horizontalEdge = 'bottom';
            data.theme = 'success';
            $.notific8($("#smsDeleted").val(), data);
        },
        "error": function () {
            var data = new Object();
            data.verticalEdge = 'right';
            data.horizontalEdge = 'bottom';
            data.theme = 'theme';
            $.notific8($("#smsDeleteFail").val(), data);
        }
    };

    $rootScope.$on("admin:dashboard:getShipperList", function(event, args){
        $scope.onlineShipper = socketAdmin.listOnlineShipper.length;
    });

    $rootScope.$on("shipper:change:order:status", function(event,args){
        //alert(2);
        getDataFromServer();
    });

    $rootScope.$on("shipper:change:task:status", function(event,args){
        getDataFromServer();
    });
}


adminDashboardController.$inject = ['$scope','$state','dataService','config','$rootScope','socketAdmin'];

angular.module('app').controller('adminDashboardController',adminDashboardController);

