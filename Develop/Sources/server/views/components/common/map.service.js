





/*
    Helper functions
*/
var icons = {
    shipperIcon: 'http://maps.google.com/mapfiles/kml/shapes/motorcycling.png',           
    storeIcon: 'http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
    customerIcon: 'http://maps.google.com/mapfiles/kml/shapes/man.png',
    sourceIcon: 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=S|FFFF00|000000',
    disabledIcon: 'http://chart.apis.google.com/chart?' +
        'chst=d_map_pin_letter&chld=x|3366FF',
};

function initShipper(geocoder, maps, shipperMarker) {
    shipperMarker.icon = icons.shipperIcon;
}

function initStore(geocoder, maps, storeMarker) {
    storeMarker.icon = icons.storeIcon;    
    geocoder.geocode({
        'location': {
            lat: storeMarker.latitude,
            lng: storeMarker.longitude
        }
    }, function(results, status) {        
        var geoText = 'Not Available';
        if (status === maps.GeocoderStatus.OK) {
            if (results[0]) {
                geoText = results[0].formatted_address;

            }
        }               
        storeMarker.geoText = geoText;                                   
    }); 
}

function initCustomer(geocoder, maps, customerMarker, orders) {    
    customerMarker.customerID = customerMarker.order[0];
    customerMarker.order.forEach(function(order) {        
        orders[order].customerID = customerMarker.customerID;
    });

    customerMarker.icon = icons.customerIcon;
    geocoder.geocode({
        address: customerMarker.geoText
    }, function(results, status) {
        if (status === maps.GeocoderStatus.OK) {
            customerMarker.latitude = results[0].geometry.location.lat();
            customerMarker.longitude = results[0].geometry.location.lng();
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function mapService($q,$http,uiGmapGoogleMapApi,uiGmapIsReady){        
    var shipperMarkers = [];
    var storeMarkers = [];
    var customerMarkers = [];
    var orders = {};

    var api = {};
    api.googlemap = uiGmapGoogleMapApi.then(function(maps){         
        var geocoder = new maps.Geocoder;           
        var distanceService = new maps.DistanceMatrixService;                   
        var directionsService = new maps.DirectionsService;
        
        var util = {
            maps: maps,
            geocoder: geocoder,
            distanceService: distanceService,
            directionsService: directionsService
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
                    var results = response.rows[0].elements.map(function(element) {
                        return element.distance;
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


    api.getShipperMarkers = function(mode) {      
        // use $http instead          
        shipperMarkers = sampleData[mode].shipper;
        return shipperMarkers;
    }

    api.addShipper = function(shipper) {        
        this.googlemap.then(function(util) {            
            initShipper(util.geocoder, util.maps, shipper);            
            shipperMarkers.push(shipper);
        });                
    }

    api.getOneShipper = function(shipperID) {
        return _.find(storeMarkers, function(shipper) {
            return shipper.shipperID == shipperID;
        });
    }


    api.getStoreMarkers = function(mode) {      
        // use $http instead      
        storeMarkers = sampleData[mode].store;
        return storeMarkers;
    }

    api.addStore = function(store) {        
        this.googlemap.then(function(util) {            
            initStore(util.geocoder, util.maps, store);            
            storeMarkers.push(store);
        });        
    }

    api.getOneStore = function(storeID) {
        return _.find(storeMarkers, function(store) {
            return store.storeID == storeID;
        });
    }

    api.getCustomerMarkers = function(mode) {      
        // use $http instead      
        customerMarkers = sampleData[mode].customer;
        return customerMarkers;
    }    

    api.addCustomer = function(customer) {        
        this.googlemap.then(function(util) {            
            initCustomer(util.geocoder, util.maps, customer, orders);            
            customerMarkers.push(customer);
        });        
    }

    api.getOrders = function(mode) {      
        // use $http instead      
        orders = sampleData[mode].orders;
        return orders;
    }        

    return api;
}

mapService.$inject = ['$q','$http','uiGmapGoogleMapApi','uiGmapIsReady'];

angular.module('app').factory('mapService', mapService);





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