/**
 * Created by KhanhKC on 18/11/2015.
 */

function storeOrderHistoryController($rootScope,$scope,dataService,$state, $http, $filter, config) {

    $scope.orderList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'Order ID',
            value: 'orderid'
        },
        {
            option: 'Status',
            value: 'orderstatus.statusname'
        }];

    $scope.dateOptions = [
        {
            option: 'Create date',
            value: 'createdate'
        },
        {
            option: 'Complete Date',
            value: 'completedate'
        }];
    $scope.selected = $scope.searchOptions[0];
    $scope.selectedDate = $scope.dateOptions[0];
    $scope.dateRange = '';

    getDataFromServer();
    function getDataFromServer() {
        var urlBase = config.baseURI + '/api/store/getAllOrder';
        dataService.getDataServer(urlBase)
        .then(function(response){
        $scope.orderList = response.data;
        $scope.orderList.sort(function (a,b) {
            if (a.completedate < b.completedate) return -1;
            if (a.completedate > b.completedate) return 1;
            return 0;
        });
        $scope.displayedCollection = [].concat($scope.orderList);
        
    })
    }

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

    /*
     by HoangLVQ - 24/11/2015
     This function is used to listen event which reload status order
     */
    $rootScope.$on("updateStatusOrder", function(event, data){
        getDataFromServer();
        if(data.msg.profile) {
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


}

storeOrderHistoryController.$inject = ['$rootScope','$scope','dataService','$state', '$http', '$filter', 'config'];
angular.module('app').controller('storeOrderHistoryController',storeOrderHistoryController);