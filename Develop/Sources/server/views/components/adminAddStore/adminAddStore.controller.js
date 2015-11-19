/**
 * Created by Hoang on 10/18/2015.
 */

function adminAddStoreController($scope,$state, $http, $filter, config) {

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

        $http.post(config.baseURI + "/api/shipper/addNewShipper", $scope.newShipper).success(function(response){
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

    $(document).ready(function() {
        $('#rootwizard').bootstrapWizard({
            tabClass:"nav-wizard",
            onTabShow: function(tab, navigation, index) {
                tab.prevAll().addClass('completed');
                tab.nextAll().removeClass('completed');
                if(tab.hasClass("active")){
                    tab.removeClass('completed');
                }
                var $total = navigation.find('li').length;
                var $current = index+1;
                var $percent = ($current/$total) * 100;
                $('#rootwizard').find('.progress-bar').css({width:$percent+'%'});
                $('#rootwizard').find('.wizard-status span').html($current+" / "+$total);
            }
        });

        $('#validate-wizard').bootstrapWizard({
            tabClass:"nav-wizard",
            onNext: function(tab, navigation, index) {
                var content=$('#step'+index);
                if(typeof  content.attr("parsley-validate") != 'undefined'){
                    var $valid = content.parsley( 'validate' );
                    if(!$valid){
                        return false;
                    }
                };
                // Set the name for the next tab
                $('#step4 h3').find("span").html($('#fullname').val());
            },
            onTabClick: function(tab, navigation, index) {
                $.notific8('Please click <strong>next button</strong> to wizard next step!! ',{ life:5000, theme:"danger" ,heading:" Wizard Tip :); "});
                return false;
            },
            onTabShow: function(tab, navigation, index) {
                tab.prevAll().addClass('completed');
                tab.nextAll().removeClass('completed');
                if(tab.hasClass("active")){
                    tab.removeClass('completed');
                }
                var $total = navigation.find('li').length;
                var $current = index+1;
                var $percent = ($current/$total) * 100;
                $('#validate-wizard').find('.progress-bar').css({width:$percent+'%'});
                $('#validate-wizard').find('.wizard-status span').html($current+" / "+$total);
            }
        });

    });


}

adminAddStoreController.$inject = ['$scope','$state', '$http', '$filter', 'config'];
angular.module('app').controller('adminAddStoreController',adminAddStoreController);