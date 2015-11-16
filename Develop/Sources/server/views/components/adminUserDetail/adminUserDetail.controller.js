/**
 * Created by Hoang on 10/18/2015.
 */

function adminUserDetailController($scope,$state, $http, $filter, config, $stateParams) {
    $scope.username = $stateParams.username; //getting fooVal
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    //$scope.newShipper.profile.dob = null;

    $http.get(config.baseURI + "/api/user/" + $scope.username).success(function(response){
        $scope.user = response;
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
        $http.put(config.baseURI + "/api/userProfile/" + $scope.user.username,  $scope.user.profile).success(function(response){
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);
        },function (error) {
            smsData.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail").val(), smsData);
            console.log(error)
        })
    }

     //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminUserDetailController.$inject = ['$scope','$state', '$http', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminUserDetailController',adminUserDetailController);