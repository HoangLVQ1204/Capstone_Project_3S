/**
 * Created by Hoang on 10/18/2015.
 */

function adminController($scope,$state){


    $scope.$watch('$viewContentLoaded', function(event) {

        caplet();

    });
}

adminController.$inject = ['$scope','$state'];
angular.module('app').controller('adminController',adminController);