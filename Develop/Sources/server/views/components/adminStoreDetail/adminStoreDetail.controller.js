/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreDetailController($scope,$state, dataService, $filter, config, $stateParams) {
    $scope.storeid = $stateParams.storeid; //getting fooVal
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    //$scope.newShipper.profile.dob = null;

    dataService.getDataServer(config.baseURI + "/api/storeDetail/" + $scope.storeid).then(function(response){
        $scope.store = response.data;
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
        dataService.putDataServer(config.baseURI + "/api/store/" + $scope.store.storeid,  $scope.store).then(function(response){
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

adminStoreDetailController.$inject = ['$scope','$state', 'dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminStoreDetailController',adminStoreDetailController);