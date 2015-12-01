





function mapServiceFn($q,$http,uiGmapGoogleMapApi,uiGmapIsReady,authService){        

    var shipperMarkers = [];
    var storeMarkers = [];
    var customerMarkers = [];
    var orders = {};

    var returnedShipperMarkers = [];
    var returnedStoreMarkers = [];
    var returnedCustomerMarkers = [];
    var returnedOrders = {};

    // { type: 'all' }
    // { type: 'shipper', shipperID: xxx }
    // { type: 'store', storeID: xxx }
    // { type: 'orderdetail', orderID: xxx }
    var currentMode = { type: 'all' };

    var api = {};

    api.setMode = function(mode) {
        currentMode = mode;
        api.updateReturnedValues();
        console.log('api.setMode', returnedStoreMarkers, returnedShipperMarkers);
    };

    api.getMode = function() {
        return currentMode;
    }

    api.updateReturnedShippers = function() {
        returnedShipperMarkers.splice(0, returnedShipperMarkers.length);
        if (currentMode.type == 'all') {            
            shipperMarkers.forEach(function(e) {
                returnedShipperMarkers.push(_.clone(e, true));
            });
        } else if (currentMode.type == 'orderdetail') {
            var currentUser = authService.getCurrentInfoUser();
            for (var k = 0; k < shipperMarkers.length; ++k) {
                var e = _.clone(shipperMarkers[k], true);
                e.order = e.order.filter(function(item) {
                    return item == currentMode.orderID;
                });
                if (e.order.length > 0 || currentUser.userrole == 1) returnedShipperMarkers.push(e);
            }
        } else if (currentMode.type == 'shipper') {            
            var find = _.find(shipperMarkers, function(e) {
                return currentMode.shipperID == e.shipperID;
            });
            if (find) returnedShipperMarkers.push(_.clone(find, true));
        } else if (currentMode.type == 'store') {
            for (var i = 0; i < shipperMarkers.length; ++i) {
                var e = _.clone(shipperMarkers[i], true);
                e.order = e.order.filter(function(item) {
                    return orders[item].storeID == currentMode.storeID;
                });
                if (e.order.length > 0) {
                    returnedShipperMarkers.push(e);
                }
            }
        }
    };

    api.updateReturnedStores = function() {
        returnedStoreMarkers.splice(0, returnedStoreMarkers.length);
        if (currentMode.type == 'all') {            
            storeMarkers.forEach(function(e) {
                returnedStoreMarkers.push(_.clone(e, true));
            });
        } else if (currentMode.type == 'orderdetail') {
            var currentUser = authService.getCurrentInfoUser();            
            for (var k = 0; k < storeMarkers.length; ++k) {
                var e = _.clone(storeMarkers[k], true);
                e.order = e.order.filter(function(item) {
                    return item == currentMode.orderID;
                });
                if (e.order.length > 0 || currentUser.userrole == 2) returnedStoreMarkers.push(e);
            }            
        } else if (currentMode.type == 'store') {            
            var find = _.find(storeMarkers, function(e) {
                return currentMode.storeID == e.storeID;
            });
            if (find) returnedStoreMarkers.push(_.clone(find, true));
        } else if (currentMode.type == 'shipper') {
            for (var i = 0; i < storeMarkers.length; ++i) {
                var e = _.clone(storeMarkers[i], true);
                e.order = e.order.filter(function(item) {
                    return orders[item].shipperID == currentMode.shipperID;
                });
                if (e.order.length > 0) {
                    returnedStoreMarkers.push(e);
                }
            }
        }
    };

    api.updateReturnedCustomers = function() {
        returnedCustomerMarkers.splice(0, returnedCustomerMarkers.length);
        if (currentMode.type == 'all') {            
            customerMarkers.forEach(function(e) {
                returnedCustomerMarkers.push(_.clone(e, true));
            });
        } else if (currentMode.type == 'orderdetail') {
            for (var k = 0; k < customerMarkers.length; ++k) {
                var e = _.clone(customerMarkers[k], true);
                e.order = e.order.filter(function(item) {
                    return item == currentMode.orderID;
                });
                if (e.order.length > 0) returnedCustomerMarkers.push(e);
            }
        } else if (currentMode.type == 'shipper') {            
            for (var i = 0; i < customerMarkers.length; ++i) {
                var e = _.clone(customerMarkers[i], true);
                e.order = e.order.filter(function(item) {
                    return orders[item].shipperID == currentMode.shipperID;
                });
                if (e.order.length > 0) {
                    returnedCustomerMarkers.push(e);
                }
            }
        } else if (currentMode.type == 'store') {
            for (var i = 0; i < customerMarkers.length; ++i) {
                var e = _.clone(customerMarkers[i], true);
                e.order = e.order.filter(function(item) {
                    return orders[item].storeID == currentMode.storeID;
                });
                if (e.order.length > 0) {
                    returnedCustomerMarkers.push(e);
                }
            }
        }
    };

    api.updateReturnedOrders = function() {
        for (var prop in returnedOrders) delete returnedOrders[prop];
        if (currentMode.type == 'all') {            
            for (var prop in orders) returnedOrders[prop] = _.clone(orders[prop], true);
        } else if (currentMode.type == 'orderdetail') {
            returnedOrders[currentMode.orderID] = _.clone(orders[currentMode.orderID], true);
        } else if (currentMode.type == 'shipper') {            
            for (var prop in orders) {
                if (orders[prop].shipperID == currentMode.shipperID) {
                    returnedOrders[prop] = _.clone(orders[prop], true);
                }
            }
        } else if (currentMode.type == 'store') {
            for (var prop in orders) {
                if (orders[prop].storeID == currentMode.storeID) {
                    returnedOrders[prop] = _.clone(orders[prop], true);
                }
            }
        }  
    };

    api.updateReturnedValues = function() {
        api.updateReturnedShippers();
        api.updateReturnedStores();
        api.updateReturnedCustomers();
        api.updateReturnedOrders();
    };

    api.getShipperMarkers = function() {
        return returnedShipperMarkers;
    };

    api.getStoreMarkers = function() {
        return returnedStoreMarkers;
    };

    api.getCustomerMarkers = function() {
        return returnedCustomerMarkers;
    };

    api.getOrders = function() {
        return returnedOrders;
    };

    api.googlemap = uiGmapGoogleMapApi.then(function(maps){         

        var geocoder = new maps.Geocoder;
        var distanceService = new maps.DistanceMatrixService;                   
        var directionsService = new maps.DirectionsService;
        
        var util = {
            // maps: maps,
            // geocoder: geocoder,
            // distanceService: distanceService,
            // directionsService: directionsService
        };

        // get geotext from latitude and longitude
        util.getGeoText = function(latitude, longitude) {
            var d = $q.defer();
            console.log("latitude: " + latitude + " - longitude: " + longitude );
            geocoder.geocode({
                'location': {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude)
                }
            }, function(results, status) {                
                if (status === maps.GeocoderStatus.OK) {
                    var geoText = 'Not Available';
                    if (results[0]) {
                        geoText = results[0].formatted_address;                
                    }                    
                    d.resolve(geoText);
                } else {
                    d.reject('Geocode was not successful for the following reason: ' + status);
                }
            }); 

            return d.promise;
        };

        // get latitude and longitude from geoText
        util.getLatLng = function(geoText) {
            var d = $q.defer();
            geocoder.geocode({
                address: geoText
            }, function(results, status) {
                if (status === maps.GeocoderStatus.OK) {                    
                    d.resolve({
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng()
                    });
                } else {
                    d.reject('Geocode was not successful for the following reason: ' + status);            
                }
            });

            return d.promise;
        };

        util.getDistanceFromOneToMany = function(origin, destinations) {
            var _origin = origin.map(function(e) {
                return {
                    lat: e.latitude,
                    lng: e.longitude
                }
            });
            var _destinations = destinations.map(function(e) {
                return {
                    lat: e.latitude,
                    lng: e.longitude
                }
            });

            var d = $q.defer();
            distanceService.getDistanceMatrix({
                origins: _origin,
                destinations: _destinations,
                travelMode: maps.TravelMode.DRIVING,
                unitSystem: maps.UnitSystem.METRIC,
                durationInTraffic: true,    // Only in Google Map Work API
                avoidHighways: false,
                avoidTolls: false
            }, function(response, status) {             
                if (status == maps.DistanceMatrixStatus.OK) {
                    var results = response.rows[0].elements.map(function(element, index) {
                        return {
                            distance: element.distance,
                            id: index
                        }
                    });                    
                    d.resolve(results);
                } else {
                    d.reject(status);
                }
            }); 
            return d.promise;
        };                
        
        return util;                
    });    

    api.setMapData = function(mapData) {
        for (orderID in orders) delete orders[orderID];
        for (orderID in mapData.orders) orders[orderID] = _.clone(mapData.orders[orderID], true);
        shipperMarkers.splice(0, shipperMarkers.length);
        mapData.shipper.forEach(function(e) {
            shipperMarkers.push(_.clone(e, true));
        });        
        storeMarkers.splice(0, storeMarkers.length);
        mapData.store.forEach(function(e) {
            storeMarkers.push(_.clone(e, true));
        });        
        customerMarkers.splice(0, customerMarkers.length);
        mapData.customer.forEach(function(e) {
            customerMarkers.push(_.clone(e, true));
        });            
        console.log('SET shipper', shipperMarkers);
        console.log('SET store', storeMarkers);
        console.log('SET orders', orders);
        console.log('SET customer', customerMarkers);    
        api.updateReturnedValues();
    };

    return api;
}

mapServiceFn.$inject = ['$q','$http','uiGmapGoogleMapApi','uiGmapIsReady','authService'];

angular.module('app').factory('mapService', mapServiceFn);


// Sample Data from dataTest.json
var sampleData = {
    "all": {
        "shipper": [
            {
                "order" : ["order1"],
                "latitude": 21.028784,
                "longitude": 105.826088,
                "shipperID": "shipper_1",
                "status": "status 111"                                                    
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
                "storeID": "store_1"
                /*
                "status": ["Waiting"
                    "Picking up"
                    "Bring to stock"
                    "In stock"
                    "Delivering"
                    "Done"
                    "Canceling"
                    "Cancel"],
                "isPending": false
                */
            },
            "order2": {
                "shipperID": "shipper_2",
                "storeID": "store_1"
            },
            "order3": {
                "shipperID": "shipper_2",
                "storeID": "store_2"
            },
            "order4": {
                "shipperID": "shipper_3",
                "storeID": "store_2"
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