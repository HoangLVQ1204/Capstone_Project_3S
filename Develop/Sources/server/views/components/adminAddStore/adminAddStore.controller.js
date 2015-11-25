/**
 * Created by Hoang on 10/18/2015.
 */

function adminAddStoreController($scope,$state, $http, $filter, config) {

    $scope.shipperList = [];

    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    $scope.newStoreOwner = new Object();
    $scope.newStoreOwner.account = new Object();
    $scope.newStoreOwner.profile = new Object();
    $scope.newStoreOwner.profile.avatar = "assets/avatar/store_ower/Default.png";
    $scope.newStore = new Object();
    $scope.newStore.avatar = "assets/avatar/store/Default.jpg";
    //$scope.newStoreOwner.profile.dob = null;

    $http.get(config.baseURI + "/api/store/getNewStoreOwnerID").success(function(response){
        $scope.newStoreOwner.account.username = response;
        $scope.newStoreOwner.profile.username = response;
        //console.log(response);
    })

    $http.get(config.baseURI + "/api/store/getNewStoreID").success(function(response){
        $scope.newStore.storeid = response;
        //console.log(response);
    })

    $scope.createStore = function () {
       var valid = $('#formStore').parsley( 'validate' );
        if (!valid) return;
        $scope.newStoreOwner.account.userrole = 2;
        $scope.newStoreOwner.account.userstatus = 2;
        $scope.newStoreOwner.profile.dob = new Date($scope.newStoreOwner.profile.dob);
        $scope.newStore.registereddate = new Date();
        var promises= [];
        var managestore = new Object();
        managestore['storeid'] = $scope.newStore.storeid;
        managestore['managerid'] = $scope.newStoreOwner.account.username;
        promises.push($http.post(config.baseURI + "/api/user/addNewUser", $scope.newStoreOwner));
        promises.push($http.post(config.baseURI + "/api/store", $scope.newStore));
        Promise.all(promises).then(function () {
            promises.push($http.post(config.baseURI + "/api/store/addManageStore", managestore));
        })
       //console.log(valid);
        Promise.all(promises).then(function () {
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);
            $state.go('admin.storeList');
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
                $.notific8('Please click <strong>next button</strong> to go to next step!! ',{ life:5000, theme:"danger" ,heading:" Error :); "});
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