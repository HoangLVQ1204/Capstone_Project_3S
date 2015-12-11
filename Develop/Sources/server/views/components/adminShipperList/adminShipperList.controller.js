/**
 * Created by Hoang on 10/18/2015.
 */

function adminShipperListController($scope,$state, dataService, $filter, config, $stateParams, $rootScope, socketAdmin) {

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
    getDataFromServer();

    function getDataFromServer(){
        dataService.getDataServer(config.baseURI + "/api/shipper/getAllShipper").then(function(response){
            $scope.shipperList= response.data;
            $scope.shipperList.map(function (shipper) {
                shipper['workingStatus'] = 'Offline';
                if (shipper.userstatus == 3)  shipper['workingStatus'] = 'Block';
            })
            $scope.displayedCollection = [].concat($scope.shipperList);
            getShipperOnline();
        })
    }


    function getShipperOnline(){
        socketAdmin.listShippers.map(function (shipper) {
            var result = $.grep($scope.shipperList, function(e){ return e.username == shipper.shipperID; });

            if (shipper.isConnected)
                result[0]['workingStatus'] = 'Online';
            else
                result[0]['workingStatus'] = 'Offline';
        });
    }

    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


    $rootScope.$on("admin:dashboard:getShipperList", function(event, args){

        getShipperOnline();

    });

}

adminShipperListController.$inject = ['$scope','$state', 'dataService', '$filter', 'config', '$stateParams', '$rootScope','socketAdmin'];
angular.module('app').controller('adminShipperListController',adminShipperListController);