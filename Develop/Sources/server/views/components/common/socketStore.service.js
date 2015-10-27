/**
 * Created by hoanglvq on 10/25/15.
 */


function socketStore(socketService,authService){

    var EPSILON = 1e-8;

    var currentLocation = null;

    var api = {};

    api.registerSocket = function(){
        var currentUser = authService.getCurrentInfoUser();
        
        navigator.geolocation.getCurrentPosition(function(position){
            // if (currentLocation
            //     && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
            //     && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
            //     console.log('the same location');
            //     return;
            // }
            // console.log('different location');
            var dataStore = {
                storeID: currentUser.stores[0],
                ownStore: currentUser.username            
            };
            currentLocation = position.coords;
            dataStore.latitude = position.coords.latitude;
            dataStore.longitude = position.coords.longitude;

            socketService.emit("store:register:location",dataStore);
        },function(){
            alert("Can't get your current location! Please check your connection");
        });
    };
    
    api.findShipper = function() {                
        socketService.emit('store:find:shipper', null);
    };

    return api;        
};

socketStore.$inject = ['socketService','authService'];
angular.module('app').factory('socketStore', socketStore);