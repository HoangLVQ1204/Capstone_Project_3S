/**
 * Created by Hoang on 10/18/2015.
 */

function issueContentController($scope,$stateParams, $http, authService,config) {
    $scope.issueid = $stateParams.issueid; //getting fooVal
    console.log( $scope.issueid);
    $scope.issue = [];
    $http.get(config.baseURI + "/api/getIssueContent?issueid=" + $scope.issueid).success(function(response){
        $scope.issue = response;
        //$scope.displayedOrderCollection = [].concat($scope.orderList);
        //console.log($scope.issueList)
    })

    //console.log(authService.getCurrentInfoUser());

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

}

issueContentController.$inject = ['$scope','$stateParams', '$http', 'authService','config'];
angular.module('app').controller('issueContentController',issueContentController);