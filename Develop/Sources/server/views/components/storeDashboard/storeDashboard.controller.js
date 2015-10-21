/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$rootScope,$state){

    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();

    });
}

storeDashboardController.$inject = ['$scope','$rootScope','$state'];
angular.module('app').controller('storeDashboardController',storeDashboardController);

