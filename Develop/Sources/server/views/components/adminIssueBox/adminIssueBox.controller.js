/**
 * Created by Hoang on 10/18/2015.
 */

function adminIssueBoxController($scope,$state, $http, $filter, config) {

    $scope.issueList = [];
    $http.get(config.baseURI + "/api/getAllIssue").success(function(response){
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

    jQuery(document).ready(function() {
        jQuery("abbr.timeago").timeago();
    });

}

adminIssueBoxController.$inject = ['$scope','$state', '$http', '$filter','config'];
angular.module('app').controller('adminIssueBoxController',adminIssueBoxController);