/**
 * Created by KhanhKC on 19/11/2015.
 */

function storeProfileController($scope,$state,dataService, $http, $filter, config, $stateParams) {
    var smsData = {verticalEdge: 'right',
        horizontalEdge: 'bottom'};
    
    getStoreProfile();
    function getStoreProfile(){
        var urlBase = config.baseURI + '/api/storeDetail';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                $scope.store = rs.data;
            })
    }    

    //----------------------------------
    //FUNCTION LOAD SCRIPT
    //-----------------------------------
    $scope.$watch('$viewContentLoaded', function (event) {

        caplet();

    });


}

storeProfileController.$inject = ['$scope','$state','dataService', '$http', '$filter', 'config', '$stateParams'];
angular.module('app').controller('storeProfileController',storeProfileController);