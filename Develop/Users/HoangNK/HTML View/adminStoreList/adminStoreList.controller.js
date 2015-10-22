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
    $scope.dateRange = null;
    $http.get("http://localhost:3000/api/store/getLedger").success(function(response){
        $scope.storeList = response;
        $scope.storeList.map(function(store){
            store.paydate = "October 13, 2015 11:13:00";
            return store;
        });
        //console.log(response);
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
       // console.log( $( "#daterange").val());
    });

    $(document).ready(function() {
            $('.form_datetime')
            //Listen for the change even on the input
            .change(dateChanged)
            .on('dp.change', dateChanged)
            .on('changeDate', dateChanged);
    });

    function dateChanged() {
        alert(1);
    }



    //$('#table-example').dataTableSettings[0].aoColumns[0].bSearchable = true;



}

adminStoreListController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('adminStoreListController',adminStoreListController);