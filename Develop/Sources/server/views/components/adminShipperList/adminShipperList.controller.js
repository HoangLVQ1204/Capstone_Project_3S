/**
 * Created by Hoang on 10/18/2015.
 */

function adminShipperListController($scope,$state, $http, $filter, config) {

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

    $http.get(config.baseURI + "/api/shipper/getAllShipper").success(function(response){
        $scope.shipperList= response;
        $scope.displayedCollection = [].concat($scope.shipperList);
        console.log(response);
    })

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminShipperListController.$inject = ['$scope','$state', '$http', '$filter', 'config'];
angular.module('app').controller('adminShipperListController',adminShipperListController);