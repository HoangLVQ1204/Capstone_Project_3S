/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state,dataService, $http){
    $scope.tableColumn =['OrderID','Delivery Address', 'Customer','Customer Name','Status'];

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'OrderID',
            value: 'orderid'
        },{
            option: 'Delivery Address',
            value: 'deliveryaddress'
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
            option: 'Status',
            value: 'statusname'
        }
    ];
    $scope.searchOptionsDraff = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'OrderID',
            value: 'orderid'
        },{
            option: 'Delivery Address',
            value: 'deliveryaddress'
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
    $scope.selected =$scope.searchOptions[0];
    $scope.selected2=$scope.searchOptionsDraff[0];
    $scope.dateRange = null;
    $scope.listDraff = [];
    getDataFromServer();

    function getDataFromServer() {
        var urlBase = 'http://localhost:3000/orders';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.totalOrder = rs['Draff'].length + rs['Done'].length + rs['Issue'].length + rs['Inprocess'].length ;
                $scope.orderToday = rs['Total'][2];
                $scope.totalCod = rs['Total'][0];
                $scope.todayCod = rs['Total'][3];
                $scope.totalFee = rs['Total'][1];
                $scope.todayFee = rs['Total'][4];
                $scope.ordersDraff = rs['Draff'];
                $scope.orderIssue = rs['Issue'];
                $scope.orderInprocess= rs['Inprocess'];
                $scope.orderDone= rs['Done'];
                $scope.abc =  $scope.orderDone[0].orderid;
                $scope.displayedCollectionDraff = [].concat($scope.ordersDraff);
                $scope.displayedCollectionIssue = [].concat($scope.orderIssue);
                $scope.displayedCollectionInprocess = [].concat($scope.orderInprocess);
                $scope.displayedCollectionDone = [].concat($scope.orderDone);

                $scope.listDraff =  $scope.ordersDraff;

            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }
    $scope.Order = {};
    $scope.statusid = '7';
    $scope.setOrder = function(order){
        $scope.Order = order;
    };
    $scope.deleteDraffOrder = function () {
        var urlBase = 'http://localhost:3000/orders/'+ $scope.Order.orderid;
        dataService.deleteDataServer(urlBase);
        var index =  $scope.displayedCollectionDraff.indexOf( $scope.Order);
        if (index !== -1) {
            $scope.displayedCollectionDraff.splice(index, 1);
        }

    };

    $scope.submitDraff = function (order) {
        var urlBase = 'http://localhost:3000/orders/putdraff';
        for(var i = 0; i < $scope.listDraff.length; i++){
            if ($scope.listDraff[i].orderid == order.orderid){
                dataService.postDataServer(urlBase,$scope.listDraff[i]);
                var index =  $scope.displayedCollectionDraff.indexOf(order);
                if (index !== -1) {
                    $scope.displayedCollectionDraff.splice(index, 1);
                }
            }
        }
    };

    $scope.cancerOrder = function(){
        var urlBase = 'http://localhost:3000/orders/cancel';
        var cancelOrderInfo = {orderid:$scope.Order.orderid, statusid : $scope.statusid};
        console.log(cancelOrderInfo);
        dataService.postDataServer(urlBase,cancelOrderInfo);
        var index =  $scope.displayedCollectionInprocess.indexOf( $scope.Order);
        if (index !== -1) {
            $scope.displayedCollectionInprocess.splice(index, 1);
        }
    };


    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });

}


storeDashboardController.$inject = ['$scope','$state','dataService','$http'];

angular.module('app').controller('storeDashboardController',storeDashboardController);

