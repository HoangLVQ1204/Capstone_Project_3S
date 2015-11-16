/**
 * Created by Hoang on 10/18/2015.
 */

function adminShipperListController($scope,$state, $http, $filter, config, $stateParams) {

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

    $http.get(config.baseURI + "/api/shipper/getAllShipper").success(function(response){
        $scope.shipperList= response;
        if ($scope.topShipper) putToTop($scope.topShipper);
        $scope.displayedCollection = [].concat($scope.shipperList);
        //console.log(response);
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


}

adminShipperListController.$inject = ['$scope','$state', '$http', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminShipperListController',adminShipperListController);