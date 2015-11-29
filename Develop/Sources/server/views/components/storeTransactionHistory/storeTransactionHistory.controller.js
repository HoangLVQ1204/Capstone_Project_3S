function storeTransactionHistoryController($scope,$state, $http, $location, config, $rootScope) {

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
            option: 'Amount',
            value: 'amount'
        },
        {
            option: 'Balance',
            value: 'balance'
        },
        // {
        //     option: 'Delivery',
        //     value: 'totaldelivery'
        // },
        // {
        //     option: 'Cash on delivery',
        //     value: 'totalcod'
        // }
    ];
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
            option: 'Total',
            value: 'balance'
        },
        {
            option: 'Delivery',
            value: 'totaldelivery'
        },
        {
            option: 'Cash on delivery',
            value: 'totalcod'
        }];
    $scope.customSelected =$scope.searchCustomOptions[0];
    $scope.autoSelected =$scope.searchAutoOptions[0];
    $scope.dateRange = '';
    $scope.autoDateRange = '';

    function getDataFromServer(){
        $http.get(config.baseURI + "/api/store/ledger/getLedgerList").success(function(response){
            response.map(function(ledger){
                ledger.balance = parseInt(ledger.balance);
                ledger.totalcod = parseInt(ledger.totalcod);
                ledger.totaldelivery = parseInt(ledger.totaldelivery);

                if (ledger.amount == null)
                {
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
        });
    }

    getDataFromServer();

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

    $rootScope.$on("store:message:confirmPayment",function(data){
        getDataFromServer();
    });

    $scope.$watch('$viewContentLoaded', function (event) {
        caplet();
    });

    $scope.go = function ( path ) {
        $location.path( path );
    };

}

storeTransactionHistoryController.$inject = ['$scope','$state', '$http', '$location', 'config','$rootScope'];
angular.module('app').controller('storeTransactionHistoryController',storeTransactionHistoryController);