/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreListController($scope,$state, $http, $filter) {

    $scope.storeList = [];

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

    $http.get("http://localhost:3000/api/store/getLedger").success(function(response){
        $scope.storeList = response;

        console.log(response);
    })
    $scope.displayedCollection = [].concat($scope.storeList);

    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();
        //$('#table-example').dataTable({
        //    "aoColumns": [
        //        {"bSearchable": false},
        //        {"bSearchable": false},
        //        {"bSearchable": false},
        //        {"bSearchable": false},
        //        null
        //    ]
        //});

    });





    //$('#table-example').dataTableSettings[0].aoColumns[0].bSearchable = true;



}

adminStoreListController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('adminStoreListController',adminStoreListController);