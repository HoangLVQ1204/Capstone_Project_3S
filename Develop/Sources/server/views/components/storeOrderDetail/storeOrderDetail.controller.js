/**
 * Created by khanhkc on 14/11/15.
 */

function storeOrderDetailController($scope,$stateParams,dataService, $http, config){    
	
	$scope.orderid = $stateParams.orderid;

	getDataFromServer();
    function getDataFromServer() {
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;
        dataService.getDataServer(urlBase)
            .success(function (rs) {               
               $scope.data = rs;
               $scope.listgoods = rs.goods;
               console.log("==============rs===========",rs);
            })
            .error(function (error) {
                console.log('Unable to load order: ' + error);
            });
    }
}


storeOrderDetailController.$inject = ['$scope','$stateParams','dataService','$http','config'];

angular.module('app').controller('storeOrderDetailController',storeOrderDetailController);

