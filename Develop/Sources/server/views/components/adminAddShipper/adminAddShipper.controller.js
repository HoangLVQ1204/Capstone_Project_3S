/**
 * Created by Hoang on 10/18/2015.
 */

function adminAddShipperController($scope,$state, $http, $filter, config) {

    $scope.shipperList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    $scope.newShipper = new Object();
    $scope.newShipper.account = new Object();
    $scope.newShipper.profile = new Object();
    //$scope.newShipper.profile.dob = null;

    $http.get(config.baseURI + "/api/shipper/getNewShipperID").success(function(response){
        $scope.newShipper.account.username = response;
        $scope.newShipper.profile.username = response;
        //console.log(response);
    })

    $scope.createShipper = function () {
       var valid = $('#formID').parsley( 'validate' );
        if (!valid) return;
        $scope.newShipper.account.userrole = 1;
        $scope.newShipper.account.userstatus = 2;
        $scope.newShipper.profile.dob = new Date($scope.newShipper.profile.dob);

        $http.post(config.baseURI + "/api/user/addNewUser", $scope.newShipper).success(function(response){
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);
            $state.go('admin.shipperList', {newShipper: $scope.newShipper.account});
            //console.log(response);
        },function (error) {
            smsData.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail").val(), smsData);
            console.log(error)
        })
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