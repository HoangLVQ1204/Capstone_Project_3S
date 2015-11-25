/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreListController($scope,$state, $http, authService, config, socketAdmin) {

    $scope.storeList = [];
    $scope.payfrom = '1';
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
        }
        ];
    $scope.selected =$scope.searchOptions[0];
    $scope.dateRange = '';

    //get latest date of auto calculate
    $http.get(config.baseURI + "/api/store/getLatestAutoAccountDate").success(function(response){
        $scope.latestAutoDate= response;
        $scope.fromAutoDate = new Date($scope.latestAutoDate);
        $scope.fromAutoDate.setDate($scope.fromAutoDate.getDate()-7);
        //console.log( $scope.fromAutoDate);
    })

    //get List to display
    $http.get(config.baseURI + "/api/store/getAllLedger").success(function(response){
        $scope.storeList = response;
        $scope.storeList.sort(dateSort)
    }).then(function () {
        $http.get(config.baseURI + "/api/store/getTotalCoD").success(function(response){
            $scope.currentCoD= response;
            //console.log(2);
        })
    }).then(function () {
        $http.get(config.baseURI + "/api/store/getTotalFee").success(function(response){
            $scope.currentFee = response;
            //==//console.log(response);

            $scope.storeList.map(function (store) {
                var resultCoD = $.grep($scope.currentCoD, function(e){ return e.storeid == store.storeid; });
                if ($scope.currentCoD.length > 0)
                    store.currentCoD =  parseInt(resultCoD[0].totalCoD);

                var resultFee = $.grep($scope.currentFee, function(e){ return e.storeid == store.storeid; });
                if ($scope.currentFee.length > 0)
                store.currentFee =  parseInt(resultFee[0].totalFee);
                if (store.generalledgers.length > 0)
                store.generalledgers[0].balance =  parseInt(store.generalledgers[0].balance);

                $http.get(config.baseURI + "/api/store/getLatestLedgerOfStore/" + store.storeid).success(function(response){
                    store['currentBanlance'] = response.balance;

                    //console.log(response);
                }).then(function () {
                    if (!store['currentBanlance']) store['currentBanlance']=0;
                    return store;
                })
                //console.log(store);
            })
            //console.log($scope.storeList);
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

        //console.log($('#inputValue'));
    };

    $scope.blockConfirm = function (event, store){
        //alert(1);
        $scope.reason = "";
        $scope.selectedStore = store;
        //console.log(store);
        if (store.managestores[0].user.userstatus == 3) $scope.blocktext = 'unblock'
           else $scope.blocktext = 'block';
        event.preventDefault();
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
        var data = new Object();
        data.effect="md-slideRight";
        $("#md-effect-block").attr('class','modal fade').addClass(data.effect).modal('show');
    };

    //----------------------------------
    //FUNCTION BLOCK A STORE
    //-----------------------------------
    $scope.blockStore = function (store){
        //console.log(store);
        var valid = $('#blockReason').parsley( 'validate' );
        if (!valid) return;
        var bannedLog = new Object();
        bannedLog['adminid'] = currentUser.username;
        bannedLog['storeid'] = store.managestores[0].managerid;
        bannedLog['bannedtime'] = new Date(Date.now());
        bannedLog['reason'] = $scope.reason;

        if (store.managestores[0].user.userstatus == 2)
            {
                bannedLog['type'] = 1;
                bannedLog['userStatus'] = 3;
            }
        else {
            bannedLog['type'] = 2;
            bannedLog['userStatus'] = 2;
        }
        //console.log(bannedLog);
        $http.post(config.baseURI + "/api/log/postBannedLog", bannedLog).then(function success(response){
            //console.log(store);bal
            store.managestores[0].user.userstatus =  bannedLog['userStatus'];
            socketAdmin.blockStoreMessage(store.storeid, bannedLog['type'], bannedLog['reason']);
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);
            $("#md-effect-block").attr('class','modal fade').addClass(smsData.effect).modal('hide');

        },function (error) {
            smsData.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail").val(), smsData);
            console.log(error)
        })
        if (store.ban.length == 0) store.ban.push(bannedLog);
            else store.ban[0] = bannedLog;
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
    };

    //--------------------------
    //FUNCTION add new ledger to database
    //--------------------------
    $scope.postLedger = function (store){
        //alert(1);
        //$scope.payFee = 0;
        if (!$scope.isValid) return;

        var ledger = new Object();
        ledger.storeid = store.storeid;
        ledger.adminid = currentUser.username;
        ledger.amount = parseInt($scope.payFee);
        ledger.paydate = Date(Date.now());
        ledger.payfrom = parseInt($scope.payfrom);
        //ledger.note = 'confirm by';
        if (ledger.payfrom  == 1)
        {
            //ledger.payfrom = 1;
            ledger.totaldelivery = store.generalledgers[0].totaldelivery - ledger.amount;
            ledger.totalcod = store.generalledgers[0].totalcod;

        }
         else
        {
            ledger.payfrom = 2;
            ledger.totaldelivery = store.generalledgers[0].totaldelivery;
            ledger.totalcod = parseInt(store.generalledgers[0].totalcod) - ledger.amount;
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
            socketAdmin.confirmPaymentMessage(store.storeid);
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
    //FUNCTION SHOW TRANSACTION HISTORY
    //-----------------------------------
    $scope.showTransactionHistory = function (store, period){
        var autoDate = $scope.latestAutoDate;
        //console.log(autoDate);
        if (!period) autoDate='null';
        $http.get(config.baseURI + "/api/getLedgerOfStore/" + store.storeid +"/" + autoDate).success(function(response){
            $scope.ledgerListOfStore = response;

            $scope.ledgerListOfStore.sort(function(x, y){
                if (x.paydate > y.paydate) {
                    return -1;
                }
                if (x.paydate < y.paydate) {
                    return 1;
                }
                return 0;
            });
            $scope.ledgerListOfStore.map(function (ledger) {
                if (ledger.amount != null) {

                    ledger.amount = parseInt(ledger.amount);
                    ledger.balance = parseInt(ledger.balance);
                    ledger.totalcod = parseInt(ledger.totalcod);
                    ledger.totaldelivery = parseInt(ledger.totaldelivery);
                    ledger.lastbalance  = ledger.amount + ledger.balance;
                }
            })
            $scope.displayedLedgerCollection = [].concat($scope.ledgerListOfStore);
            $scope.selectedStore = store;
            smsData.effect="md-slideRight";
            $("#md-effect-history").attr('class','modal fade').addClass(smsData.effect).modal('show');
             //console.log(response);
        })
    }

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
    var dateSort =  function(x, y){
        if (x.registereddate > y.registereddate) {
            return -1;
        }
        if (x.registereddate < y.registereddate) {
            return 1;
        }

        if (x.storeid < y.storeid) {
            return -1;
        }
        if (x.storeid > y.storeid) {
            return 1;
        }
        return 0;
    };



}

adminStoreListController.$inject = ['$scope','$state', '$http', 'authService','config','socketAdmin'];
angular.module('app').controller('adminStoreListController',adminStoreListController);