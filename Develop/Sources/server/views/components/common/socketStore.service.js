/**
 * Created by hoanglvq on 10/25/15.
 */
angular.module('app')
    .factory('socketStore',['socketService','authService',function(socketService,authService){

        var EPSILON = 1e-8;

        var currentLocation = null;
        return {
            registerSocket: function(){
                var currentUser = authService.getCurrentInfoUser();

                var dataStore = {
                    storeID: currentUser.stores[0],
                    ownStore: currentUser.username
                };
                navigator.geolocation.watchPosition(function(position){
                    if (currentLocation
                        && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
                        && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
                        console.log('the same location');
                        return;
                    }
                    console.log('different location');
                    currentLocation = position.coords;
                    dataStore.latitude = position.coords.latitude;
                    dataStore.longitude = position.coords.longitude;

                    socketService.emit("store:register:location",dataStore);
                    socketService.on("store:register:location",function(rs){
                        if(!rs) alert("Can't get your current location! Please check your connection");
                    })

                },function(){
                    alert("Can't get your current location! Please check your connection");
                });
            }
        }
    }]);