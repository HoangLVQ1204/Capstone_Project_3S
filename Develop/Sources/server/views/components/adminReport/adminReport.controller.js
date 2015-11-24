/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http,dataService, $filter, config, $stateParams) {

    getDataFromServer();
    getDateOverView();
    function getDataFromServer() {
        var urlBase = config.baseURI + '/api/admin/report/orderCount';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                console.log("==============rs===============",rs);
                // $scope.listStore = rs;
                // $scope.selectedStore = rs.STR001;
                // $scope.listYear;
                // $scope.selectedYear = selectedStore.2015;
                // $scope.listOrderOfMonth;

            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }

    function getDateOverView(){
        var urlBase = config.baseURI + '/api/admin/report/overView';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.totalStore = rs[0].length;
                $scope.totalShipper = rs[1].length;
            })
            .error(function (error) {
                console.log('Unable to load over view data: ' + error);
            });
    }

    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminReportController.$inject = ['$scope','$state', '$http','dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);