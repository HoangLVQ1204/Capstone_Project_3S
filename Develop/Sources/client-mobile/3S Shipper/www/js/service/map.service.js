
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

function initShipper(shipperMarker, api) {
    if (!shipperMarker.order)
        shipperMarker.order = [];
    shipperMarker.icon = icons.shipperIcon;
}

function initStore(storeMarker, api) {
    if (!storeMarker.order)
        storeMarker.order = [];
    storeMarker.icon = icons.storeIcon;

    return api.googlemap.then(function(util) {
        return util.getGeoText(storeMarker.latitude, storeMarker.longitude);
    })
    .then(function(geoText) {
        storeMarker.geoText = geoText;
    });
}

// add customerID into orders
function initCustomer(customerMarker, orders, api) {
    customerMarker.customerID = customerMarker.order[0];
    customerMarker.order.forEach(function(order) {
        orders[order].customerID = customerMarker.customerID;
    });

    customerMarker.icon = icons.customerIcon;

    return api.googlemap.then(function(util) {
        return util.getLatLng(customerMarker.geoText);
    })
    .then(function(coords) {
        customerMarker.latitude = coords.latitude;
        customerMarker.longitude = coords.longitude;
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
            // maps: maps,
            // geocoder: geocoder,
            // distanceService: distanceService,
            // directionsService: directionsService
        };

        // get geotext from latitude and longitude
        util.getGeoText = function(latitude, longitude) {
            var d = $q.defer();
            geocoder.geocode({
                'location': {
                    lat: latitude,
                    lng: longitude
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


    /*
        Shipper Markers
    */
    api.getShipperMarkers = function(mode) {
        // use $http instead
        // shipperMarkers = sampleData[mode].shipper;
        return shipperMarkers;
        // return sampleData[mode].shipper;
    };

    api.containShipper = function(shipper) {
        var find = _.find(shipperMarkers, function(shipperMarker) {
            return shipper.shipperID == shipperMarker.storeID;
        });
        return !!find;
    };

    api.addShipper = function(shipper) {
        if (this.containShipper(shipper)) return Promise.resolve();
        initShipper(shipper, api);
        shipperMarkers.push(shipper);
        return Promise.resolve();
    };

    api.updateOrderOfShipper = function(shipperID, orderID) {
        for (var i = 0; i < shipperMarkers.length; ++i) {
            if (shipperMarkers[i].shipperID === shipperID) {
                shipperMarkers[i].order.push(orderID);
                return;
            }
        }
    };

    api.getOneShipper = function(shipperID) {
        console.log('getOneShipper', shipperID, shipperMarkers);
        return _.clone(_.find(shipperMarkers, function(shipper) {
            return shipper.shipperID == shipperID;
        }), true);
    };

    api.updateShipper = function(newShipper) {
        for (var i = 0; i < shipperMarkers.length; ++i) {
            if (shipperMarkers[i].shipperID === newShipper.shipperID) {
                shipperMarkers[i] = _.merge(shipperMarkers[i], newShipper);
                return;
            }
        }
    };

    api.deleteShipper = function(shipperID) {
        for (var i = shipperMarkers.length - 1; i >= 0; --i) {
            if (shipperMarkers[i].shipperID === shipperID) {
                shipperMarkers.splice(i, 1);
                return;
            }
        }
    };




    /*
        Store Markers
    */
    api.getStoreMarkers = function(mode) {
        // use $http instead
        // storeMarkers = sampleData[mode].store;
        return storeMarkers;
        //return sampleData[mode].store;
    };

    api.containStore = function(store) {
        var find = _.find(storeMarkers, function(storeMarker) {
            return store.storeID == storeMarker.storeID;
        });
        if (find) {
            return true;
        } else {
            return false;
        }
    };

    api.addStore = function(store) {
        if (this.containStore(store)) return Promise.resolve();
        return initStore(store, api)
        .then(function() {
            storeMarkers.push(store);
        })
        .catch(function(err) {
            alert(err);
        });
    };

    api.updateOrderOfStore = function(storeID, orderID) {
        for (var i = 0; i < storeMarkers.length; ++i) {
            if (storeMarkers[i].storeID === storeID) {
                storeMarkers[i].order.push(orderID);
                return;
            }
        }
    };

    api.getOneStore = function(storeID) {
        return _.clone(_.find(storeMarkers, function(store) {
            return store.storeID == storeID;
        }), true);
    };

    api.setMapData = function(mapData) {
        shipperMarkers.splice(0, shipperMarkers.length);
        mapData.shipper.forEach(function(e) {
            shipperMarkers.push(_.clone(e, true));
        });
        shipperMarkers.forEach(function(shipperMarker) {
            initShipper(shipperMarker, api);
        });

        storeMarkers.splice(0, storeMarkers.length);
        mapData.store.forEach(function(e) {
            storeMarkers.push(_.clone(e, true));
        });
        var storePromises = storeMarkers.map(function(storeMarker) {
            return initStore(storeMarker, api);
        });

        var customerPromises = Promise.all(storePromises)
        .then(function() {
            for (var e in orders) delete orders[e];
            for (var e in mapData.orders) orders[e] = _.clone(mapData.orders[e], true);

            customerMarkers.splice(0, customerMarkers.length);
            mapData.customer.forEach(function(e) {
                customerMarkers.push(_.clone(e, true));
            });
            return customerMarkers.map(function(customerMarker) {
                return initCustomer(customerMarker, orders, api)
            });
        });

        return Promise.all(customerMarkers)
        .then(function() {
            console.log('SET shipper', shipperMarkers);
            console.log('SET store', storeMarkers);
            console.log('SET orders', orders);
            console.log('SET customer', customerMarkers);
        });
    };


    /*
        Customer Markers
    */
    api.getCustomerMarkers = function(mode) {
        // use $http instead
        // customerMarkers = sampleData[mode].customer;
        return customerMarkers;
        // return sampleData[mode].customer;
    }

    api.addCustomer = function(customer) {
        return initCustomer(customer, orders, api)
        .then(function() {
            customerMarkers.push(customer);
        })
        .catch(function(err) {
            alert(err);
        });
    }



    /*
        Orders
    */
    api.getOrders = function(mode) {
        // use $http instead
        // orders = sampleData[mode].orders;
        return orders;
    };

    api.addOrder = function(orderID, store, shipper, customer) {
        orders[orderID] = {
            shipperID: shipper.shipperID,
            storeID: store.storeID,
            status: 'Picking up',
            isPending: false
        };
        return api.addStore(store)
        .then(function() {
            return api.addCustomer(customer);
        })
        .then(function() {
            api.updateOrderOfShipper(shipper.shipperID, orderID);
            api.updateOrderOfStore(store.storeID, orderID);
        });
    };

    api.updateOrder = function(orderID, newOrder) {
        orders[orderID] = _.merge(orders[orderID], newOrder);
    };


    return api;
}

mapService.$inject = ['$q','$http','uiGmapGoogleMapApi','uiGmapIsReady'];

app.factory('mapService', mapService);





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
