/**
 * Created by hoanglvq on 10/26/15.
 */


function socketShipper($q,socketService,authService,mapService) {
    
    var EPSILON = 1e-8;

    var currentLocation = null;    
    var api = {};

    /*
        add handlers
    */
    socketService.on('shipper:choose:express', function(data) {
        var answer = confirm('Do you want to accept order from store of ' + data.msg.distanceText + ' away?');                
        if (answer) {
            api.getCurrentUser()
            .then(function(user) {                
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
        })
    });

    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();
        
        d = $q.defer();
        navigator.geolocation.getCurrentPosition(function(position){            
            var dataShipper = {
                shipperID: currentUser.username,
                status: currentUser.workingstatusid
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
            if (currentLocation
                && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
                && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
                console.log('the same location');
                return;
            }
            console.log('different location');
            socketService.emit('shipper:update:location', position.coords);
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
                'shipper:register:location');
            });            
        })
        .catch(function(err){
            alert(err);
        });  
    };

    return api; 
}

socketShipper.$inject = ['$q','socketService','authService','mapService'];
angular.module('app').factory('socketShipper', socketShipper);