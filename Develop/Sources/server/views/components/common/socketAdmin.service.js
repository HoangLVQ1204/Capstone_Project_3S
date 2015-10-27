/**
 * Created by hoanglvq on 10/26/15.
 */
angular.module('app')
    .factory('socketAdmin',['socketService','authService',function(socketService,authService){

        var EPSILON = 1e-8;            

        var currentLocation = null;
        return {
            registerSocket: function(nsp){                        
                var currentUser = authService.getCurrentInfoUser();

                var dataAdmin = {
                    username: currentUser.username
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
                    dataAdmin.latitude = position.coords.latitude;
                    dataAdmin.longitude = position.coords.longitude;

                    socketService.emit("admin:register:location",dataAdmin);
                    socketService.on("admin:register:location",function(rs){
                        if(!rs) alert("Can't get your current location! Please check your connection");
                    })                    
                },function(){
                    alert("Can't get your current location! Please check your connection");
                });
            }
        }
    }]);