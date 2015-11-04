/**
 * Created by Hoang on 10/18/2015.
 */

function adminTransactionHistoryController($scope,$state, $http, $location) {

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

    $http.get("http://localhost:3000/api/ledgerList").success(function(response){
       // $scope.ledgerList = response;
        response.map(function(ledger){
            if (ledger.amount == null) $scope.autoList.push(ledger)
            else  $scope.ledgerList.push(ledger);
        })
        //console.log(1);
       //console.log(response);
    })

    $scope.displayedLedgerCollection = [].concat($scope.ledgerList);
    $scope.displayedAutoCollection = [].concat($scope.autoList);


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

adminTransactionHistoryController.$inject = ['$scope','$state', '$http', '$location'];
angular.module('app').controller('adminTransactionHistoryController',adminTransactionHistoryController);