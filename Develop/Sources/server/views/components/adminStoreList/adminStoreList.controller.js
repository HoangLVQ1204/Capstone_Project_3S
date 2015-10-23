/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreListController($scope,$state, $http, $filter) {

    $scope.storeList = [];
    $scope.searchOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'Name',
            value: 'name'
        },{
            option: 'Address',
            value: 'address'
        },{
            option: 'Payment',
            value: 'payment'
        }];
    $scope.selected =$scope.searchOptions[0];
    $scope.dateRange = null;



    $http.get("http://localhost:3000/api/store/getLedger").success(function(response){
        $scope.storeList = response;
        $scope.storeList.map(function(store){
            store.paydate = "October 13, 2015 11:13:00";
            return store;
        });
        //console.log(response);
    })
    $scope.displayedCollection = [].concat($scope.storeList);

    //----------------------------------
    //FUNCTION SHOW CONFIRM PAYMENT MODAL
    //-----------------------------------
    $scope.showConfirm = function (event, storeid){
        //alert(1);
        $scope.payFee = 0;
        $scope.payCoD = 0;
        event.preventDefault();
        $scope.getTotalFee(storeid);
        $scope.getTotalCoD(storeid);
        //console.log($scope.totalFee);
        var data=$(this).data();
        $("#md-effect").attr('class','modal fade').addClass(data.effect).modal('show')
    };

    //----------------------------------
    //FUNCTION GET TOTAL COD OF A STORE
    //-----------------------------------
    $scope.getTotalCoD = function (storeid){
        $http.get("http://localhost:3000/api/store/getTotalCoD/" + storeid).success(function(response){
            $scope.totalCoD = response;
             //console.log(response);
        })
    }

    //----------------------------------
    //FUNCTION GET TOTAL FEE OF A STORE
    //-----------------------------------
    $scope.getTotalFee = function (storeid){
        $http.get("http://localhost:3000/api/store/getTotalFee/" + storeid).success(function(response){
            $scope.totalFee = response;
            //console.log(response);
        })
    }

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });



}

adminStoreListController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('adminStoreListController',adminStoreListController);