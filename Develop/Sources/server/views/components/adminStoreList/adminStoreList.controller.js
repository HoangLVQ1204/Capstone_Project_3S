/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreListController($scope,$state, $http) {
    $scope.storeList = [{
        "name": "1",
        "address": "angular"
    }, {
        "name": "2",
        "address": "meteor"
    }];


    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();
        $('#table-example').dataTable({
            "aoColumns": [
                {"bSearchable": false},
                {"bSearchable": false},
                {"bSearchable": false},
                {"bSearchable": false},
                null
            ]
        });

        $('#table-example').dataTableSettings[0].aoColumns[0].bSearchable = true;
    });





}

adminStoreListController.$inject = ['$scope','$state', '$http'];
angular.module('app').controller('adminStoreListController',adminStoreListController);