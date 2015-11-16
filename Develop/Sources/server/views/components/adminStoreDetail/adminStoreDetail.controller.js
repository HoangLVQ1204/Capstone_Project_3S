/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreDetailController($scope,$state, $http, $filter, config, $stateParams) {
    $scope.storeid = $stateParams.storeid; //getting fooVal
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    //$scope.newShipper.profile.dob = null;

    $http.get(config.baseURI + "/api/storeDetail/" + $scope.storeid).success(function(response){
        $scope.store = response;
        //$scope.shipper.dob =  new Date($scope.shipper.dob,;
        //console.log(response);
    })

    //----------------------------------
    //FUNCTION update account info
    //-----------------------------------
    $scope.update = function(){
        var valid = $('#formID').parsley( 'validate' );
        if (!valid) return;
        //console.log($scope.user.profile);
        $http.put(config.baseURI + "/api/store/" + $scope.store.storeid,  $scope.store).success(function(response){
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

adminStoreDetailController.$inject = ['$scope','$state', '$http', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminStoreDetailController',adminStoreDetailController);