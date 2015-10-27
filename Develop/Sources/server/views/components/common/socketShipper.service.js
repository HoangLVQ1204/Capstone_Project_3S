/**
 * Created by hoanglvq on 10/26/15.
 */
angular.module('app')
    .factory('socketShipper',['socketService','authService',function(socketService,authService){

        var EPSILON = 1e-8;

        var currentLocation = null;
        return {
            registerSocket: function(){
                var currentUser = authService.getCurrentInfoUser();

                var dataShipper = {
                    username: currentUser.username,
                    status: currentUser.workingstatusid
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
                    dataShipper.latitude = position.coords.latitude;
                    dataShipper.longitude = position.coords.longitude;

                    socketService.emit("shipper:register:location",dataShipper);
                    socketService.on("shipper:register:location",function(rs){
                        if(!rs) alert("Can't get your current location! Please check your connection");
                    })

                },function(){
                    alert("Can't get your current location! Please check your connection");
                });
            }
        }
    }]);