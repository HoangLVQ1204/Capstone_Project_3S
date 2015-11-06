/**
 * Created by Hoang on 10/18/2015.
 */

function issueContentController($scope,$stateParams, $http, authService,config, $rootScope) {
    //$rootScope.$state = $state;
    //$rootScope.$stateParams = $stateParams;
    $scope.issueid = $stateParams.issueid; //getting fooVal
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};

    $scope.issue = [];
    $http.get(config.baseURI + "/api/getIssueContent?issueid=" + $scope.issueid).success(function(response){
        $scope.issue = response;

        //$scope.displayedOrderCollection = [].concat($scope.orderList);
        //console.log($scope.issueList)
    })

    $scope.updateResolve = function () {
        $http.put(config.baseURI + "/api/updateResolveIssue?issueid=" + $scope.issueid).success(function(response){
            //$scope.issue = response;
            $scope.issue.isresolved = true;
            var result = $.grep($scope.$parent.issueList, function(e){ return e.issueid == $scope.issueid; });
            if (result.length == 1)
               result[0].isresolved = true;
            smsData.theme="theme-inverse";
            $.notific8($("#sms-success").val(), smsData);

            $("#md-effect-block").attr('class','modal fade').addClass(smsData.effect).modal('hide');
            //$scope.displayedOrderCollection = [].concat($scope.orderList);
            //console.log($scope.issueList)
        },function (error) {
            smsData.theme="danger";
            //data.sticky="true";
            $.notific8($("#sms-fail").val(), smsData);
            //console.log(error)
        })
    }
    
    //console.log(authService.getCurrentInfoUser());
    $scope.showConfirm = function (event, resolveType){
        //alert(1);
        $scope.resolveType = resolveType;
        event.preventDefault();
        //$scope.getLatestLedgerOfStore(storeid);
        //console.log( $scope.selectedStore.totalcod);
        //var data=$(this).data();
        var data = new Object();
        data.effect="md-slideRight";
        $("#md-effect-block").attr('class','modal fade').addClass(data.effect).modal('show');
    };

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });

}

issueContentController.$inject = ['$scope','$stateParams', '$http', 'authService','config','$rootScope'];
angular.module('app').controller('issueContentController',issueContentController);