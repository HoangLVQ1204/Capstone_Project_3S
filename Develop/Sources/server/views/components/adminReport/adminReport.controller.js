/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http, $filter, config, $stateParams) {
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    //$scope.newShipper.profile.dob = null;

    $http.get(config.baseURI + "/api/storeDetail").success(function(response){
        $scope.store = response;
        //$scope.shipper.dob =  new Date($scope.shipper.dob,;
        console.log(response);
    })    

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

adminReportController.$inject = ['$scope','$state', '$http', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);