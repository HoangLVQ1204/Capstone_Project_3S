/**
 * Created by Hoang on 10/18/2015.
 */

function adminStoreListController($scope,$state){


    $scope.$on('$viewContentLoaded', function(event) {

        caplet();

    });
}

adminStoreListController.$inject = ['$scope','$state'];
angular.module('app').controller('adminStoreListController',adminStoreListController);