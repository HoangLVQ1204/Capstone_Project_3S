/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state,dataService, $http, config, $rootScope){

    //Option for drop down list
    $scope.searchOptionsInProcess = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'Order ID',
            value: 'orderid'
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
            option: 'Delivery Address',
            value: 'fullDeliveryAddress'
        },
        // {
        //     option: 'Create Date',
        //     value: 'createdate'
        // },
        {
            option: 'Type',
            value: 'ordertype'
        },
        {
            option: 'Status',
            value: 'statusname'
        }

    ];
    $scope.searchOptionsDone = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'Order ID',
            value: 'orderid'
        },
        // {
        //     option: 'Done Date',
        //     value: 'donedate'
        // },
        {
            option: 'Delivery Address',
            value: 'fullDeliveryAddress'
        },
        {
            option: 'Cusotmer',
            value: 'recipientname'
        },
        {
            option: 'Customer Phone',
            value: 'recipientphone'
        }
    ];
    $scope.searchOptionsDraff = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'Order ID',
            value: 'orderid'
        },{
            option: 'Delivery Address',
            value: 'fullDeliveryAddress'
        },
        {
            option: 'Cusotmer',
            value: 'recipientname'
        },
        {
            option: 'Customer Phone',
            value: 'recipientphone'
        }
    ];
    

    //
    $scope.selectedInprocess =$scope.searchOptionsInProcess[0];
    $scope.selectedDone=$scope.searchOptionsDone[0];
    $scope.selectedDraff=$scope.searchOptionsDraff[0];
    //$scope.selectedIssue=$scope.searchOptionsIssue[0];
    $scope.dateRangeInprocess = null;
    $scope.dateRangeDone = null;
    $scope.dateRangeDraff = null;
    //$scope.dateRangeIssue = null;
    $scope.listDraff = [];
    getDataFromServer();

    function getDataFromServer() {
        var urlBase = config.baseURI + '/orders';
        dataService.getDataServer(urlBase)
            .then(function (res) {
                var rs = res.data;
                console.log("======================",rs);
                $scope.orderToday = rs['Total'][2];
                $scope.totalCod = rs['Total'][0];
                $scope.todayCod = rs['Total'][3];
                $scope.totalFee = rs['Total'][1];
                $scope.todayFee = rs['Total'][4];
                $scope.totalOrder = rs['Total'][5];
                $scope.ordersDraff = rs['Draff'];
                $scope.orderInprocess= rs['Inprocess'];
                $scope.orderDone= rs['Done'];

                $scope.displayedCollectionDraff = [].concat($scope.ordersDraff);
                $scope.displayedCollectionInprocess = [].concat($scope.orderInprocess);
                $scope.displayedCollectionDone = [].concat($scope.orderDone);

                $scope.listDraff =  $scope.ordersDraff;


            },function(error){
                console.log(error);
                if(error.status == 401){
                    dataService.signOutWhenTokenFail()
                }

            })
            //.error(function (error) {
            //
            //});
    }
    $scope.Order = {};

    //get order when click on delete/submit/edit button on tables orders
    $scope.setOrder = function(order){
        $scope.Order = order;
        $scope.setCancelFee(order);
    };

    //set cancel fee for notification for cancel in process order function
    $scope.setCancelFee = function (order) {
        $scope.cancelFee = 0;
        if(order.statusname != 'Waiting'){
            $scope.cancelFee = order.fee*10/100;
        }
    };

    //cancel in process order
    $scope.cancerOrder = function(){
        var urlBase = config.baseURI + '/store/orders/cancel';
            dataService.postDataServer(urlBase,{
                orderid : $scope.Order.orderid
            });        
        // var index =  $scope.displayedCollectionInprocess.indexOf( $scope.Order);
        // if (index !== -1) {
        //     $scope.displayedCollectionInprocess.splice(index, 1);
        //     $scope.orderInprocess.splice(index, 1);
        // }
    };

    //delete Draff order
    $scope.deleteDraffOrder = function () {
        var urlBase = config.baseURI + '/orders/'+ $scope.Order.orderid;
        dataService.deleteDataServer(urlBase).then(function(ss){
            var index =  $scope.displayedCollectionDraff.indexOf( $scope.Order);
            if (index !== -1) {
                $scope.displayedCollectionDraff.splice(index, 1);
                $scope.ordersDraff.splice(index, 1);
            }
            alertDelete.success();
        },function(err){
            alertDelete.error();
        });


    };

    //submit draff order
    $scope.submitDraff = function (order) {
        var urlBase = config.baseURI + '/orders/putdraff';
        for(var i = 0; i < $scope.listDraff.length; i++){
            if ($scope.listDraff[i].orderid == order.orderid){
                dataService.postDataServer(urlBase,$scope.listDraff[i]);
                var index =  $scope.displayedCollectionDraff.indexOf(order);
                if (index !== -1) {
                    $scope.ordersDraff.splice(index, 1)
                    $scope.displayedCollectionDraff.splice(index, 1);
                    
                }
            }
        }
    };



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
    $rootScope.$on("evChange", function(event, data){
        console.log("AAA");
        getDataFromServer();
        //SHOW INFORMATION OF THE SHIPPER WHO PICKED ORDER
        if(data.msg.profile) {
            $scope.theShipper = data.msg.profile;
            $scope.thePickedOrder = data.msg.order;
            console.dir($scope.theShipper);
            $("#informMsg").modal("show");
            setTimeout(function () {
                $("#informMsg").modal("hide");
            }, 3000);
        }
        //END SHOW INFORMATION OF SHIPPER
    });
    $scope.theShipper = {};
    $scope.thePickedOrder = '';
    $scope.hostServer = config.hostServer;
    // END listen to socket changes

    // START Listen to socket changes
    $rootScope.$on("store:dashboard:getShipperList", function(event, args){
        //alert(args.message);
        console.log('args');
        console.log(args);
        $rootScope.onlineShipper = 0;
        args.map(function (shipper) {
            if (shipper.isConnected) $rootScope.onlineShipper++;

        });
        //$scope.$apply();
        //getDataFromServer();
       // console.log( $scope.onlineShipper);
        //$scope.onlineShipper = 10;
    });

    $scope.findShipperAgain = function(order) {
        console.log('findShipperAgain', order);
        $rootScope.findExpressShipper({
            orderID: order.orderid, 
            customerAddress: order.fullDeliveryAddress
        }, {}, true);
    };
}


storeDashboardController.$inject = ['$scope','$state','dataService','$http','config','$rootScope'];

angular.module('app').controller('storeDashboardController',storeDashboardController);

