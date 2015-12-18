/**
 * Created by Hoang on 10/18/2015.
 */

function adminAddShipperController($scope,$state, $http, $filter, config, dataService) {

    $scope.shipperList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    $scope.newShipper = new Object();
    $scope.newShipper.account = new Object();
    $scope.newShipper.profile = new Object();
    $scope.newShipper.profile.avatar = "assets/avatar/shipper/Default.png";

    var urlBase = config.baseURI + "/api/shipper/getNewShipperID";
    dataService.getDataServer(urlBase)
        .then(function(rs){
            $scope.newShipper.account.username = rs.data;
            $scope.newShipper.profile.username = rs.data;
            //console.log(response);
        });

    $scope.createShipper = function () {        
       var valid = $('#formID').parsley( 'validate' );       
        if (!valid) return;
        $scope.newShipper.account.userrole = 1;
        $scope.newShipper.account.userstatus = 2;
        $scope.newShipper.profile.dob = new Date($scope.newShipper.profile.dob);

        var urlBase = config.baseURI + "/api/user/addNewUser";
        dataService.postDataServer(urlBase, $scope.newShipper)
            .then(function(rs){
                //console.log('AAAAA', rs);
                smsData.theme="theme-inverse";
                $.notific8($("#sms-success").val(), smsData);
                $state.go('admin.shipperList', {newShipper: $scope.newShipper.account});
                //console.log(response);
            })
            .catch(function(error){
                smsData.theme="danger";
                $.notific8($("#sms-fail").val(), smsData);
                console.log(error);
            });

        //function (error) {
        //    smsData.theme="danger";
        //    //data.sticky="true";
        //    $.notific8($("#sms-fail").val(), smsData);
        //    console.log(error)
        //})
       //console.log(valid);
    }
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminAddShipperController.$inject = ['$scope','$state', '$http', '$filter', 'config', 'dataService'];
angular.module('app').controller('adminAddShipperController',adminAddShipperController);