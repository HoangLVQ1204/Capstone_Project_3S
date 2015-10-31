/**
 * Created by hoanglvq on 10/22/15.
 */

angular.module('app')
    .directive('map',function(){
        return {
            controller: 'mapController',
            templateUrl: '/components/map/map.html',
            controllerAs: 'map',
            replace: true,
            restrict: 'E',
            scope: {
                shipperMarkers: '=',
                storeMarkers: '=',
                customerMarkers: '=',
                orders: '=',
                circleRadius: '='
            }
        }
    });


// Map Demo [ will remove later ]
// angular.module('app')
// .config(function($stateProvider,$urlRouterProvider) {
//     //$urlRouterProvider.otherwise('/mapdemo');

//     $stateProvider
//         .state('mapdemo',{
//             url: '/mapdemo',
//             template: '<map style="margin-top: 10px" shipper-markers="shippers" store-markers="stores" customer-markers="customers" orders="orders"></map>',
//             controller: function($scope,mapService) {

//                 // mode in ["all", "shipper", "store", "orderdetail"]          
//                 var mode = "all";

//                 //$scope.shippers = mapService.getShipperMarkers(mode);
//                 //$scope.stores = mapService.getStoreMarkers(mode);
//                 //$scope.customers = mapService.getCustomerMarkers(mode);
//                 //$scope.orders = mapService.getOrders(mode);
//                 $scope.shippers = sampleData[mode].shipper;
//                 $scope.stores = sampleData[mode].store;
//                 $scope.customers = sampleData[mode].customer;
//                 $scope.orders = sampleData[mode].orders;
//             }
//         })
// });

