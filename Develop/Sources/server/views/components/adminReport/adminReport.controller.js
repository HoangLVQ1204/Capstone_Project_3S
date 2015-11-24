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
                 $scope.listStore = rs;
                 $scope.selectedStore = rs[0];
                 $scope.listYear = $scope.selectedStore.years;
                 $scope.selectedYear = $scope.listYear[0];
                 $scope.listOrderOfMonth = $scope.selectedYear.months;
                 var selectedMonth = $scope.listOrderOfMonth[0];
                 //console.log("==============exoress===============",selectedMonth);
                 // console.log("==============normal===============",selectedMonth.types[1].countNum);
                setTimeout(function(){
                    caplet();
                },200);
                 
            })
            .error(function (error) {
                caplet();
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
        console.log("CHEHENJGKJEBFJGKFY=====================================");
        // caplet();

    });


}

adminReportController.$inject = ['$scope','$state', '$http','dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);