/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http,dataService, $filter, config, $stateParams) {

    getDataFromServer();
    function getDataFromServer() {
        var urlBase = config.baseURI + '/api/admin/order/countOrder?storeid='+ 'STR001'+'&year='+'2015';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                console.log("==============rs===============",rs);
                $scope.listYear;                
                $scope.listStore;
                $scope.listOrderOfMonth;

            })
            .error(function (error) {
                console.log('Unable to load customer data: ' + error);
            });
    }

    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminReportController.$inject = ['$scope','$state', '$http','dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);