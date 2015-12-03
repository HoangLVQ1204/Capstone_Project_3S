/**
 * Created by Hoang on 10/18/2015.
 */

function adminAcceptStoreController($scope,$state, $http, $filter, config, $stateParams) {

    //$scope.topShipper = $stateParams.newShipper; //getting fooVal
    //console.log($scope.topShipper);
    $scope.storeList = [];
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'StoreID',
            value: 'storeid'
        },
        {
            option: 'Owner',
            value: 'managestores[0].user.profile.name'
        },
        {
            option: 'Name',
            value: 'name'
        },{
            option: 'Address',
            value: 'address'
        },{
            option: 'Phone Number',
            value: 'phonenumber'
        },{
            option: 'Email',
            value: 'email'
        }];
    $scope.selected = $scope.searchOptions[0];
    $scope.dateRange = '';


    $http.get(config.baseURI + "/api/getInactiveStore").success(function(response){
        $scope.storeList= response;
        $scope.displayedCollection = [].concat($scope.storeList);
        //console.log(response);
    })

    //----------------------------------
    //FUNCTION show confirm dialog
    //-----------------------------------
    $scope.showConfirm = function (store, type) {
        $scope.selectedStore = store;
        $scope.type = type;
        smsData.effect="md-flipVer";
        $("#md-effect-confirm").attr('class','modal fade').addClass(smsData.effect).modal('show');
    }

    //----------------------------------
    //FUNCTION accept/reject
    //-----------------------------------
    $scope.acceptStore = function (store) {
        var index = $scope.storeList.indexOf(store);
        $scope.storeList.splice(index, 1);
        if ( $scope.type == 'accept') {
            store.managestores[0].user.userstatus = 2;
            $http.put(config.baseURI + "/api/user/" + store.managestores[0].user.username,  store.managestores[0].user).success(function(response){
                $("#md-effect-confirm").attr('class', 'modal fade').addClass(smsData.effect).modal('hide');
                smsData.theme="theme-inverse";
                $.notific8($("#sms-accept-success").val(), smsData);
                console.log(error)
            },function (error) {
                smsData.theme="danger";
                //data.sticky="true";
                $.notific8($("#sms-fail").val(), smsData);
                console.log(error)
            })
        }
        else {
            store.managestores[0].user.userstatus = null;
            $http.put(config.baseURI + "/api/user/" + store.managestores[0].user.username,  store.managestores[0].user).success(function(response){
                $("#md-effect-confirm").attr('class', 'modal fade').addClass(smsData.effect).modal('hide');
                smsData.theme="theme-inverse";
                $.notific8($("#sms-reject-success").val(), smsData);
            },function (error) {
                smsData.theme="danger";
                $.notific8($("#sms-fail").val(), smsData);
                console.log(error)
            })
        }
    }
    
    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminAcceptStoreController.$inject = ['$scope','$state', '$http', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminAcceptStoreController',adminAcceptStoreController);