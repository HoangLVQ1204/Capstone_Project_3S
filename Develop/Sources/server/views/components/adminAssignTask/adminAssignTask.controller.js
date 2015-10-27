/**
 * Created by Hoang on 10/18/2015.
 */
function adminAssignTaskController($scope,$state, $http, $filter) {

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });



}

adminAssignTaskController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('adminAssignTaskController',adminAssignTaskController);