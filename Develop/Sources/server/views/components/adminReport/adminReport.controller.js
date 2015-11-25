/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http,dataService, $filter, config, $stateParams) {
    $scope.height = 300;
    getCodFeeFromServer();
    getExNoFromServer();
    getDateOverView();
    $scope.listStore = [];
    function getExNoFromServer() {
        var urlBase = config.baseURI + '/api/admin/report/orderCount';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                 $scope.listStore = rs;                 
                 $scope.selectedStore = rs[0];
                 $scope.listYear = $scope.selectedStore.years;
                 $scope.selectedYear = $scope.listYear[0];
                 $scope.listOrderOfMonth = $scope.selectedYear.months;
                 setTimeout(function(){
                    caplet();
                },200);
                 
            })
            .error(function (error) {
                caplet();
                console.log('Unable to load customer data: ' + error);
            });
    }

    $scope.updateDate = function(){
        console.log("=========yeah hoo===================!")
        $scope.listYear = $scope.selectedStore.years;
        $scope.selectedYear = $scope.listYear[0];
        $scope.listOrderOfMonth = $scope.selectedYear.months;
        console.log("=========yeah hoo===================!",$scope.selectedStore);
        //caplet();
        $state.reload();
    }

    function getComCanFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        dataService.getDataServer(urlBase)
            // .success(function (rs) {
            //      $scope.listStore = rs;
            //      $scope.selectedStore = rs[0];
            //      $scope.listYear = $scope.selectedStore.years;
            //      $scope.selectedYear = $scope.listYear[0];
            //      $scope.listExNoOfMonth = $scope.selectedYear.months;
            //      var selectedMonth = $scope.listExNoOfMonth[0];
            //      setTimeout(function(){
            //         caplet();
            //     },200);
                 
            // })
            // .error(function (error) {
            //     caplet();
            //     console.log('Unable to load customer data: ' + error);
            // });
    }
    function getCodFeeFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                console.log("==================rtrt===rs==========",rs);
                 $scope.listStoreFin = rs;
                 $scope.selectedStoreFin = rs[0];
                 $scope.listYearFin = $scope.selectedStoreFin.years;
                 $scope.selectedYearFin = $scope.listYearFin[0];
                 $scope.listCodFeeOfMonthFin = $scope.selectedYearFin.months;
                //  setTimeout(function(){
                //     caplet();
                // },200);
                 
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
                $scope.totalOrder = rs[2][0].totalOrder;
                if(rs[2][0].totalFee >1000){
                    $scope.totalFee = rs[2][0].totalFee/1000 + ' K';    
                }
                
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