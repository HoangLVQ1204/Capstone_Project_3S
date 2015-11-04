/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreListController($scope,$state, $http, $filter, config) {

    $scope.storeList = [];
    var smsData = {verticalEdge: 'right',
                horizontalEdge: 'bottom'};
    var currentUser = authService.getCurrentInfoUser();
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
    $scope.dateRange = '';


    $http.get(config.baseURI + "/api/store/getAllLedger").success(function(response){
        $scope.storeList = response;
        //console.log(1);
       //console.log(response);
    }).then(function () {
        $http.get(config.baseURI + "/api/store/getTotalCoD").success(function(response){
            $scope.currentCoD= response;
            //console.log(2);
        })
    }).then(function () {
        $http.get(config.baseURI + "/api/store/getTotalFee").success(function(response){
            $scope.currentFee = response;
            //console.log(response);
            var i=0;
            $scope.storeList.map(function (store) {
                store.currentCoD =  $scope.currentCoD[i].totalCoD;
                store.currentFee =  $scope.currentFee[i].totalFee;
                store.generalledgers[0].balance =  parseInt(store.generalledgers[0].balance);
               //console.log(store.currentCoD);
                i++;
                return store;
            })
        })

    })

    $scope.displayedCollection = [].concat($scope.storeList);

    //----------------------------------
    //FUNCTION SHOW CONFIRM PAYMENT MODAL
    //-----------------------------------
    $scope.showConfirm = function (event, store){
        //alert(1);
        $scope.payFee = 0;
        $scope.payCoD = 0;
        $scope.selectedStore = store;
        event.preventDefault();
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
        var data = new Object();
        data.effect="md-flipVer";
        $("#md-effect-confirm").attr('class','modal fade').addClass(data.effect).modal('show');
        $("#inputValue").val(0);
        $scope.isValid = $('#inputValue').parsley( 'validate' );

        console.log($('#inputValue'));
    };

    $scope.blockConfirm = function (event, store){
        //alert(1);
        $scope.selectedStore = store;
        event.preventDefault();
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
        var data = new Object();
        data.effect="md-slideRight";
        $("#md-effect-block").attr('class','modal fade').addClass(data.effect).modal('show');
    };

    $scope.blockStore = function (store){
        //alert(1);
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
    };


    $scope.postLedger = function (store){
        //alert(1);
        //$scope.payFee = 0;
        if (!$scope.isValid) return;

        var ledger = new Object();
        ledger.storeid = store.storeid;
        ledger.adminid = currentUser.username;
        ledger.amount = parseInt($scope.payFee);
        ledger.paydate = Date(Date.now());
        if (ledger.amount >= 0)
        {
            ledger.payfrom = 1;
            ledger.totaldelivery = store.generalledgers[0].totaldelivery - ledger.amount;
            ledger.totalcod = store.generalledgers[0].totalcod;

        }
         else
        {
            ledger.payfrom = 2;
            ledger.totaldelivery = store.generalledgers[0].totaldelivery;
            ledger.totalcod = parseInt(store.generalledgers[0].totalcod) + ledger.amount;
        }
        ledger.balance = ledger.totaldelivery - ledger.totalcod;
        //console.log(ledger);
        if (ledger.balance == 0){
            $http.put(config.baseURI +"/api/store/updateLedgerForOrder/" + ledger.storeid).success(function(response){
                //console.log(1);
                //console.log(response);

                //store.generalledgers[0].balance = ledger.balance;
            })
        }

        $http.post(config.baseURI + "/api/store/postNewLedger", ledger).then(function success(response){
            //$scope.currentCoD= response;
            store.generalledgers[0].totalcod = ledger.totalcod;
            store.generalledgers[0].totaldelivery = ledger.totaldelivery;
            store.generalledgers[0].balance = ledger.balance;
            //console.log(store);
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);
            $("#md-effect-confirm").attr('class','modal fade').addClass(smsData.effect).modal('hide');
        },function (error) {
            smsData.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail").val(), smsData);
            console.log(error)
        })

    };



    //----------------------------------
    //FUNCTION GET TOTAL COD OF A STORE
    //-----------------------------------
    $scope.getLatestLedgerOfStore = function (storeid){
        $http.get(config.baseURI + "/api/store/getLatestLedgerOfStore/" + storeid).success(function(response){
            $scope.ledger = response;
             //console.log(response);
        })
    }

    //----------------------------------
    //FUNCTION GET TOTAL COD OF A STORE
    //-----------------------------------
    this.getTotalCoD = function (){
        ////console.log(11);
        $http.get(config.baseURI + "/api/store/getTotalCoD").success(function(response){
            $scope.currentFee= response;
            //console.log(response);
        })
    }

    //----------------------------------
    //FUNCTION GET TOTAL FEE OF A STORE
    //-----------------------------------
    this.getTotalFee = function (){
        $http.get(config.baseURI + "/api/store/getTotalFee").success(function(response){
            $scope.currentCoD = response;
            //console.log(response);
        })
    }

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

    $scope.checkOK = function(event){
        //console.log(1);
        $scope.isValid = $('#inputValue').parsley( 'validate' );

    };

    //$('#daterange').find().on('click.daterangepicker', function(ev, picker) {
    //    alert(1);
    //});




}

adminStoreListController.$inject = ['$scope','$state', '$http', '$filter','config'];
angular.module('app').controller('adminStoreListController',adminStoreListController);