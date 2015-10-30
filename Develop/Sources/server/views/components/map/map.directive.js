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
//angular.module('app')
//.config(function($stateProvider,$urlRouterProvider) {
//    //$urlRouterProvider.otherwise('/mapdemo');
//
//    $stateProvider
//        .state('mapdemo',{
//            url: '/mapdemo',
//            template: '<map style="margin-top: 10px" shipper-markers="shippers" store-markers="stores" customer-markers="customers" orders="orders"></map>',
//            controller: function($scope,mapService) {
//
//                // mode in ["all", "shipper", "store", "orderdetail"]
//                var mode = "all";
//
//                $scope.shippers = mapService.getShipperMarkers(mode);
//                $scope.stores = mapService.getStoreMarkers(mode);
//                $scope.customers = mapService.getCustomerMarkers(mode);
//                $scope.orders = mapService.getOrders(mode);
//            }
//        })
//});



// Sample Data from dataTest.json
var sampleData = {
    "all": {
        "shipper": [
            {
                "order" : ["order1"],
                "latitude": 21.028784,
                "longitude": 105.826088,
                "shipperID": "shipper_1",
                "status": "status 111",
                "currentDestination": {
                	
                }
                /*
                "markerID"
                "geoText"
                "distance"
                "duration", // client

                "latitude"
                "longitude"
                "shipperID"
                "status"    // server   
                */                
            },
            {
                "order" : ["order3","order2"],
                "latitude": 21.029434,
                "longitude": 105.832050,
                "shipperID": "shipper_2",
                "status": "status 222"
            },
            {
                "order" : ["order4"],
                "latitude": 21.031918,
                "longitude": 105.826514,
                "shipperID": "shipper_3",
                "status": "status 333"
            }
        ],
        "store": [
            {
                "order" : ["order1","order2"],
                "latitude": 21.025869,
                "longitude": 105.826310,
                "storeID": "store_1"
            },
            {
                "order" : ["order3","order4"],
                "latitude": 21.026700,
                "longitude": 105.823510,
                "storeID": "store_2"  
            }
        ],
        "customer": [
            {
                "order" : ["order1","order3"],                
                "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"

                /*
                "geoText"                
                */
            },
            {
                "order" : ["order2"],
                "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
            },
            {
                "order" : ["order4"],
                "geoText": "112 Giảng Võ,Đống Đa,Hà Nội,Việt Nam"
            }
        ],              
        "orders": {            
            "order1": {
                "shipperID": "shipper_1",
                "storeID": "store_1",                
            },
            "order2": {
                "shipperID": "shipper_2",
                "storeID": "store_1",                
            },
            "order3": {
                "shipperID": "shipper_2",
                "storeID": "store_2",                
            },
            "order4": {
                "shipperID": "shipper_3",
                "storeID": "store_2",                
            }
        }                
    },

    "shipper" : {   // detail of shipper_2
        "shipper": [
            {
                "order" : ["order2","order3"],                
                "latitude": 21.029434,
                "longitude": 105.832050,
                "shipperID": "shipper_2",
                "status": "status 222"
            }
        ],
        "store": [
            {
                "order": ["order2"],
                "latitude": 21.025869,
                "longitude": 105.826310,
                "storeID": "store_1"
            },
            {
                "order": ["order3"],
                "latitude": 21.026700,
                "longitude": 105.823510,
                "storeID": "store_2"
            }
        ],
        "customer": [
            {
                "order": ["order3"],
                "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
            },
            {
                "order": ["order2"],
                "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
            }
        ],
        "orders": {
            "order2": {
                "shipperID": "shipper_2",
                "storeID": "store_1"                
            },
            "order3": {
                "shipperID": "shipper_2",
                "storeID": "store_2",                
            }
        }
    },

    "store" : {     // detail of store_1
        "shipper": [
            {
                "order" : ["order1"],
                "latitude": 21.028784,
                "longitude": 105.826088,
                "shipperID": "shipper_1",
                "status": "status 111"
            },
            {
                "order" : ["order2"],
                "latitude": 21.029434,
                "longitude": 105.832050,
                "shipperID": "shipper_2",
                "status": "status 222"
            }
        ],
        "store":[
            {
                "order": ["order1","order2"],
                "latitude": 21.025869,
                "longitude": 105.826310,
                "storeID": "store_1"
            }
        ],
        "customer":[
            {
                "order" : ["order1"],                
                "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
            },
            {
                "order" : ["order2"],
                "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
            }
        ],
        "orders": {
            "order1": {
                "shipperID": "shipper_1",
                "storeID": "store_1"
            },
            "order2": {
                "shipperID": "shipper_2",
                "storeID": "store_1"
            }
        }
    },

    "orderdetail": {
        "shipper": [
            {
                "order": ["order1"]                
            }
        ],
        "store": [
            {
                "order": ["order1"]
            }
        ],
        "custormer":[
            {
                "order": ["order1"]
            }
        ],
        "order": {            
        }
    }
}