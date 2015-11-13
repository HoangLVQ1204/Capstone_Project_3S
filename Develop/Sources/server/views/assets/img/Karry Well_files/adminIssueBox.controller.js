/**
 * Created by Hoang on 10/18/2015.
 */

function adminIssueBoxController($scope,$state, $http, $filter, config) {
    //alert(0);
    $scope.issueList = [];
    $http.get(config.baseURI + "/api/getAllIssue").success(function(response){
        $scope.issueList = response;
        $scope.issueList.sort( $scope.sortByDate);
        //$scope.displayedOrderCollection = [].concat($scope.orderList);
        //console.log($scope.issueList)
    }).then(function () {

        $state.go('admin.issueBox.content',{issueid: $scope.issueList[0].issueid},{
            //reload: true,
        });

        //alert(1);
    })

    $scope.sortByDate = function (x, y) {
            if (x.createddate > y.createddate) {
                return -1;
            }
            if (x.createddate < y.createddate) {
                return 1;
            }
            if (!x.isresolved && y.isresolved) return -1;
            if (x.isresolved && !y.isresolved) return 1;
            if (x.issuetype.typename < y.issuetype.typename) {
                return -1;
            }
            if (x.issuetype.typename > y.issuetype.typename) {
                return 1;
            }
            return 0;

    }

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();


    });


}

adminIssueBoxController.$inject = ['$scope','$state', '$http', '$filter','config'];
angular.module('app').controller('adminIssueBoxController',adminIssueBoxController);