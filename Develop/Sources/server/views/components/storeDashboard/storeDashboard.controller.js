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
                console.log("=========fgfgfgfgf=============",rs);
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
            })
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
            dataService.postDataServer(urlBase,{orderid : $scope.Order.orderid})
            .then(function(rs){
               getDataFromServer();
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
            var temp = {
                    type: 'info',
                    title: 'Info',
                    content: 'Order '+$scope.Order.orderid + 'has been deleted successfully!',
                    url: '',
                };
                $rootScope.notify(temp);
        },function(err){
            var temp = {
                    type: 'issue',
                    title: 'OOPS!',
                    content: 'Fail to delete order '+$scope.Order.orderid,
                    url: '',
                };
                $rootScope.notify(temp);
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

    /*
        by HoangLVQ - 24/11/2015
        This function is used to listen event which reload status order
    */
    $rootScope.$on("updateStatusOrder", function(event, data){
        getDataFromServer();
        if(data.msg.profile){
            $rootScope.displayInfoShipper(data.msg.profile,data.msg.order);
        }
    });

    /*
        by HoangLVQ - 24/11/2015
        This function is used to listen event which update pendding order
    */    
     $rootScope.$on("updatePendingOrder", function(event, data){
        getDataFromServer();
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

