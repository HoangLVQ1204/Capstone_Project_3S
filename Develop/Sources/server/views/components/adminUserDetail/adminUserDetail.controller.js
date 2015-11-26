/**
 * Created by Hoang on 10/18/2015.
 */

function adminUserDetailController($scope,$state, dataService, $filter, config, $stateParams) {
    $scope.username = $stateParams.username; //getting fooVal
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    //$scope.newShipper.profile.dob = null;

    dataService.getDataServer(config.baseURI + "/api/user/" + $scope.username).then(function(response){
        $scope.user = response.data;
        //$scope.shipper.dob =  new Date($scope.shipper.dob,;
        //console.log(response);
    })

    //----------------------------------
    //FUNCTION update account info
    //-----------------------------------
    $scope.updateAccountInfo = function(){
        var valid = $('#formID').parsley( 'validate' );
        if (!valid) return;
        //console.log($scope.user.profile);
        dataService.putDataServer(config.baseURI + "/api/userProfile/" + $scope.user.username,  $scope.user.profile).then(function(response){
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);
        }) .catch(function(error){
            smsData.theme="danger";
            $.notific8($("#sms-fail").val(), smsData);
            console.log(error);
        })
    }

     //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminUserDetailController.$inject = ['$scope','$state', 'dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminUserDetailController',adminUserDetailController);