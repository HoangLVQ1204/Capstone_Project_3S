/**
 * Created by hoanglvq on 10/26/15.
 */


function socketShipper($rootScope, $q,socketService,authService,mapService) {


    var EPSILON = 1e-8;

    var currentLocation = null;
    var api = {};

    /*
     add handlers
     */

    socketService.on('shipper:register:location', function(data) {
        mapService.setMapData(data.msg.mapData)
            .then(function() {
                console.log('register', data);
            });
    });

    socketService.on('shipper:choose:express', function(data) {

        var answer = confirm('Do you want to accept order from store of ' + data.msg.distanceText + ' away?');
        console.log("---DATA RECEIVE---");
        console.log(data);
        console.log("---DATA RECEIVE---");

        if(answer) {

            api.getCurrentUser()
                .then(function(user) {
                    user.distanceText = data.msg.distanceText;
                    user.durationText = data.msg.durationText;

                    authService.getProfileUser()
                        .then(function(res){
                            user.fullName    = res.data.name;
                            user.avatar      = res.data.avatar;
                            user.phonenumber = res.data.phonenumber;

                            console.log("-- DATA BEFORE SEND --");
                            console.log(res);
                            console.log("-- DATA BEFORE SEND --");

                            socketService.sendPacket(
                                {
                                    type: 'shipper',
                                    clientID: user.shipperID
                                },
                                data.sender,
                                {
                                    shipper: user
                                },
                                'shipper:choose:express');
                        })
                })
                .catch(function(err) {
                    alert(err);
                });
        }
    });

    socketService.on('shipper:add:order', function(data) {
        var msg = data.msg;
        mapService.addOrder(msg.orderID, msg.store, msg.shipper, msg.customer)
            .then(function() {
                console.log('shipper add order', data);
                // console.log('after add order', mapService.getStoreMarkers(), mapService.getCustomerMarkers(), mapService.getOrders());
            });
    });

    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();
        console.log('api.getCurrentUser', currentUser);
        d = $q.defer();
        navigator.geolocation.getCurrentPosition(function(position){
            var dataShipper = {
                shipperID: currentUser.username
            };
            currentLocation = position.coords;
            dataShipper.latitude = position.coords.latitude;
            dataShipper.longitude = position.coords.longitude;

            d.resolve(dataShipper);
        },function(){
            d.reject("Can't get your current location! Please check your connection");
        });

        return d.promise;
    };

    api.watchCurrentPosition = function() {
        var geo_success = function(position) {
            // if (currentLocation
            //     && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
            //     && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
            //     console.log('the same location');
            //     return;
            // }
            console.log('different location');
            currentLocation = position.coords;
            var currentUser = authService.getCurrentInfoUser();            
            socketService.sendPacket(
                {
                    type: 'shipper',
                    clientID: currentUser.username
                },
                ['admin', { room: currentUser.username }],
                {
                    shipper: {
                        shipperID: currentUser.username,
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude
                    }
                },
                'shipper:update:location');
        };

        var geo_failure = function(err) {
            console.log('geo_failure', err);
        };

        var geo_options = {
            enableHighAccuracy: true,
            maximumAge        : Infinity,
            timeout           : Infinity
        };

        if (navigator.geolocation) {
            return navigator.geolocation.watchPosition(geo_success, geo_failure, geo_options);
        }
    };

    api.stopWatchCurrentPosition = function(watchID) {
        navigator.geolocation.clearWatch(watchID);
    };

    api.registerSocket = function(){
        socketService.authenSocket();
        api.getCurrentUser()
            .then(function(user) {

                mapService.addShipper(user)
                    .then(function() {
                        socketService.sendPacket(
                            {
                                type: 'shipper',
                                clientID: user.shipperID
                            },
                            'server',
                            {
                                shipper: user
                            },
                            'client:register');

                        // Test watch position
                        // var watchID = api.watchCurrentPosition();
                        // setTimeout(function() {
                        //     console.log('stop watch');
                        //     api.stopWatchCurrentPosition(watchID);
                        // }, 10000);
                    });
            })
            .catch(function(err){
                alert(err);
            });
    };

    return api;
}

socketShipper.$inject = ['$rootScope', '$q','socketService','authService','mapService'];
angular.module('app').factory('socketShipper', socketShipper);