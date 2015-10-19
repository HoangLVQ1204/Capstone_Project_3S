/**
 * Created by hoanglvq on 9/22/15.
 */

function storeDashboardController($scope,$state){

    $scope.$watch('$viewContentLoaded', function(event) {

        caplet();

    });

}

storeDashboardController.$inject = ['$scope','$state'];
angular.module('app').controller('storeDashboardController',storeDashboardController);

