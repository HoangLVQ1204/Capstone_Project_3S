/**
 * Created by hoanglvq on 9/22/15.
 */

function adminDashboardController($scope,$state,dataService, $http, config, $rootScope){

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

    //$scope.searchOptionsIssue= [
    //    {
    //        option: 'All',
    //        value: ''
    //    },
    //    {
    //        option: 'Order ID',
    //        value: 'orderid'
    //    },{
    //        option: 'Delivery Address',
    //        value: 'deliveryaddress'
    //    },
    //    {
    //        option: 'Cusotmer',
    //        value: 'recipientname'
    //    },
    //    {
    //        option: 'Customer Phone',
    //        value: 'recipientphone'
    //    }
    //];

    //
    $scope.selectedInactive =$scope.searchOptionsInactive[0];
    $scope.selectedDone=$scope.searchOptionsInactive[0];
    $scope.selectedActive=$scope.searchOptionsInactive[0];
    $scope.selectedFail=$scope.searchOptionsInactive[0];

    $scope.dateRangeInactive = null;
    $scope.dateRangeActive = null;
    $scope.dateRangeDone = null;
    $scope.dateRangeFail = null;
    $scope.inactiveList = [];
    $scope.doneList = [];
    $scope.activeList = [];
    $scope.failList = [];
    $scope.totalTaskToday = 0;
    $scope.totalDoneToday = 0;

    getDataFromServer();

    function getDataFromServer() {
        var urlBase = config.baseURI + "/api/getTaskList";

        dataService.getDataServer(urlBase)
            .success(function (taskList) {
                taskList.map(function (task) {
                     if (task.statusid == 1)  $scope.inactiveList.push(task);
                     if (task.statusid == 2)  $scope.activeList.push(task);
                     if (task.statusid == 3)  $scope.doneList.push(task);
                     if (task.statusid == 4)  $scope.failList.push(task);
                     if (dateCompare(new Date(task.taskdate), new Date(Date.now()))) {
                         $scope.totalTaskToday++;
                         if (task.statusid == 3) $scope.totalDoneToday++;
                     }
                })
                    $scope.displayedInactiveList = [].concat($scope.inactiveList);
                    $scope.displayedActiveList = [].concat($scope.activeList);
                    $scope.displayedDoneList = [].concat($scope.doneList);
                    $scope.displayedFailList = [].concat($scope.failList);

            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });

        var urlBaseTotal = config.baseURI + "/api/getTodayTotal";
        dataService.getDataServer(urlBaseTotal)
            .success(function (total) {
                $scope.todayTotal = total;
            })
    }

    var dateCompare = function (date1, date2) {
        return (date1.getDate() == date2.getDate()
                    && date1.getMonth() == date2.getMonth()
                    && date1.getFullYear() == date2.getFullYear())
    }


    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
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


    // START Listen to socket changes
    //$rootScope.$on("evChange", function(event, args){
    //    alert(args.message);
    //    console.log(args);
    //    getDataFromServer();
    //});
    // END listen to socket changes

}


adminDashboardController.$inject = ['$scope','$state','dataService','$http','config','$rootScope'];

angular.module('app').controller('adminDashboardController',adminDashboardController);

