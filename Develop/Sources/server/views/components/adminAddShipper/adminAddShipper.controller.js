/**
 * Created by Hoang on 10/18/2015.
 */

function adminAddShipperController($scope,$state, $http, $filter, config) {

    $scope.shipperList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

    $scope.createShipper = function () {
       var valid = $('#formID').parsley( 'validate' );
       //console.log(valid);
    }
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminAddShipperController.$inject = ['$scope','$state', '$http', '$filter', 'config'];
angular.module('app').controller('adminAddShipperController',adminAddShipperController);