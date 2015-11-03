/**
 * Created by Hoang on 10/18/2015.
 */

function issueContentController($scope,$state, $http, $filter) {

    $scope.issueList = [];
    $http.get("http://localhost:3000/api/getAllIssue").success(function(response){
        $scope.issueList = response;
        //$scope.displayedOrderCollection = [].concat($scope.orderList);
        console.log($scope.issueList)
    })


    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

}

issueContentController.$inject = ['$scope','$state', '$http', '$filter'];
angular.module('app').controller('issueContentController',issueContentController);