/**
 * Created by Hoang on 10/18/2015.
 */

function adminController($scope,$state){


    $rootScope.$on('$viewContentLoaded', function(event) {

        caplet();

    });
}

adminController.$inject = ['$scope','$state'];
angular.module('app').controller('adminController',adminController);