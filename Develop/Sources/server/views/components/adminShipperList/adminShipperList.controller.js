/**
 * Created by Hoang on 10/18/2015.
 */

function adminShipperListController($scope,$state, dataService, $filter, config, $stateParams, $rootScope) {

    //$scope.topShipper = $stateParams.newShipper; //getting fooVal
    //console.log($scope.topShipper);
    $scope.shipperList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'ShipperID',
            value: 'profile.shipperid'
        },
        {
            option: 'Name',
            value: 'profile.name'
        },{
            option: 'Address',
            value: 'profile.address'
        }];
    $scope.selected = $scope.searchOptions[0];
    $scope.dateRange = '';

    dataService.getDataServer(config.baseURI + "/api/shipper/getAllShipper").then(function(response){
        $scope.shipperList= response.data;
        $scope.shipperList.map(function (shipper) {
            shipper['workingStatus'] = 'Offline';
            if (shipper.userstatus == 3)  shipper['workingStatus'] = 'Block';
        })
        //if ($scope.topShipper) putToTop($scope.topShipper);
        $scope.displayedCollection = [].concat($scope.shipperList);
        console.log(response);
    })

    //----------------------------------
    //FUNCTION put new shipper to top
    //-----------------------------------
    //var putToTop = function (topShipper) {
    //    var result = $.grep($scope.shipperList, function(e){ return e.username == $scope.topShipper.username; });
    //    var indexTask = $scope.shipperList.indexOf(result[0]);
    //    $scope.shipperList.unshift($scope.shipperList[indexTask]);
    //    $scope.shipperList.tasks.splice(indexTask+1, 1);
    //    console.log($scope.shipperList);
    //}
    
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

    // START Listen to socket changes
    $rootScope.$on("admin:dashboard:getShipperList", function(event, args){
        //alert(args.message);
        console.log(args);
        //$scope.onlineShipper = 0;
        args.map(function (shipper) {
            var result = $.grep($scope.shipperList, function(e){ return e.username == shipper.shipperID; });
            if (shipper.isConnected) result[0]['workingStatus'] = 'Online';
            else result[0]['workingStatus'] = 'Offline';
        })
        //getDataFromServer();
    });
    // END listen to socket changes
}

adminShipperListController.$inject = ['$scope','$state', 'dataService', '$filter', 'config', '$stateParams', '$rootScope'];
angular.module('app').controller('adminShipperListController',adminShipperListController);