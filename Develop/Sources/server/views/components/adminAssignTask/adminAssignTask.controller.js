/**
 * Created by Hoang on 10/18/2015.
 */
function adminAssignTaskController($scope,$state, $http, $filter) {

    $scope.shipperList = [];
    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'Name',
            value: 'name'
        },{
            option: 'Address',
            value: 'address'
        },{
            option: 'Payment',
            value: 'payment'
        }];
    $scope.selected =$scope.searchOptions[0];
    $scope.dateRange = null;


    $http.get("http://localhost:3000/api/getAllShipper").success(function(response){
        $scope.shipperList = response;
        $scope.displayedCollection = [].concat($scope.shipperList);

        //console.log(1);
        //console.log(response);
    })


    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });



}

adminAssignTaskController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('adminAssignTaskController',adminAssignTaskController);