/**
 * Created by hoanglvq on 9/22/15.
 */

<<<<<<< HEAD
function storeDashboardController($scope,$rootScope,$state){
=======
function storeDashboardController($scope,$state, dataService){
>>>>>>> f109561d4225a8aa2477abdf3a5921dfbdb00a37

    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();

    });

    getDataFromServer();

    function getDataFromServer() {
        var urlBase = 'http://localhost:3000/api/history';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.orders = rs;
                alert(111);
                console.log(rs);
            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }
}

<<<<<<< HEAD
storeDashboardController.$inject = ['$scope','$rootScope','$state'];
=======
storeDashboardController.$inject = ['$scope','$state','dataService'];
>>>>>>> f109561d4225a8aa2477abdf3a5921dfbdb00a37
angular.module('app').controller('storeDashboardController',storeDashboardController);

