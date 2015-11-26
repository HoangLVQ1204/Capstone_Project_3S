/**
 * Created by Hoang on 10/18/2015.
 */

function adminIssueBoxController($scope,$state, $http, $filter, config, $rootScope, dataService, socketAdmin) {
    //alert(0);
    getDataFromSever();

    function getDataFromSever() {
        $scope.issueList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        //$scope.unreadMail = 10;
        dataService.getDataServer(config.baseURI + "/api/getAllIssue").then(function(response){
            $scope.issueList = response.data;
            $scope.issueList.sort( $scope.sortByDate);
            //$scope.displayedOrderCollection = [].concat($scope.orderList);
            //console.log($scope.issueList)
        }).then(function () {

            $state.go('admin.issueBox.content',{issueid: $scope.issueList[0].issueid},{
                //reload: true,
            });

            //alert(1);
        })
    }


    $scope.numberOfPages=function(){
        return Math.ceil($scope.issueList.length/$scope.pageSize);
    }

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


    // START Listen to socket changes
    $rootScope.$on("admin:issue:newIssue", function(event, args){
        dataService.getDataServer(config.baseURI + "/api/getAllIssue").then(function(response){
            $scope.issueList = response.data;
            $scope.issueList.sort( $scope.sortByDate);
            //$scope.displayedOrderCollection = [].concat($scope.orderList);
            //console.log($scope.issueList)
        })
    });
}

adminIssueBoxController.$inject = ['$scope','$state', '$http', '$filter','config','$rootScope','dataService','socketAdmin'];
angular.module('app').controller('adminIssueBoxController',adminIssueBoxController);