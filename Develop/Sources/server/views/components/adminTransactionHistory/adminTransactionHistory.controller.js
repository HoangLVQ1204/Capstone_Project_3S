/**
 * Created by Hoang on 10/18/2015.
 */

function adminTransactionHistoryController($scope,$state, $http, $location, config) {

    $scope.ledgerList = [];
    $scope.autoList = [];
    var smsData = {verticalEdge: 'right',
                horizontalEdge: 'bottom'};

    $scope.searchCustomOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'LedgerID',
            value: 'ledgerid'
        },
        {
            option: 'Store',
            value: 'store.name'
        },{
            option: 'Amount',
            value: 'amount'
        },{
            option: 'Balance',
            value: 'balance'
        },{
            option: 'Delivery',
            value: 'totaldelivery'
        },{
            option: 'Cash on delivery',
            value: 'totalcod'
        }];

    $scope.searchAutoOptions = [
        {
            option: 'All',
            value: ''
        },
        {
            option: 'LedgerID',
            value: 'ledgerid'
        },
        {
            option: 'Store',
            value: 'store.name'
        },{
            option: 'Total',
            value: 'balance'
        },{
            option: 'Delivery',
            value: 'totaldelivery'
        },{
            option: 'Cash on delivery',
            value: 'totalcod'
        }];
    $scope.customSelected =$scope.searchCustomOptions[0];
    $scope.autoSelected =$scope.searchAutoOptions[0];
    $scope.dateRange = '';
    $scope.autoDateRange = '';

    $http.get(config.baseURI + "/api/ledgerList").success(function(response){
       // $scope.ledgerList = response;
        response.map(function(ledger){
            ledger.balance = parseInt(ledger.balance);
            ledger.totalcod = parseInt(ledger.totalcod);
            ledger.totaldelivery = parseInt(ledger.totaldelivery);

            if (ledger.amount == null)
            {
                //ledger.fromDate = new Date(ledger.paydate);
                //ledger.fromDate.setDate(ledger.fromDate.getDate()-7);
                $scope.autoList.push(ledger)
            }
            else
            {
                $scope.ledgerList.push(ledger);
                ledger.amount = parseInt(ledger.amount);
            }
        })
        $scope.ledgerList.sort(dateSort);
        $scope.autoList.sort(dateSort);
        //console.log( $scope.ledgerList);
        //console.log(response);
    })

    $scope.displayedLedgerCollection = [].concat($scope.ledgerList);
    $scope.displayedAutoCollection = [].concat($scope.autoList);


    var dateSort =  function(x, y){
                if (x.paydate > y.paydate) {
                    return -1;
                }
                if (x.paydate < y.paydate) {
                    return 1;
                }
                return 0;
            };

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

    $scope.go = function ( path ) {
        $location.path( path );
    };

}

adminTransactionHistoryController.$inject = ['$scope','$state', '$http', '$location', 'config'];
angular.module('app').controller('adminTransactionHistoryController',adminTransactionHistoryController);