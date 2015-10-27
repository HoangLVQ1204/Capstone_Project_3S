/**
 * Created by hoanglvq on 10/26/15.
 */


function socketShipper(socketService, authService) {
    
    var EPSILON = 1e-8;

    var currentLocation = null;

    /*
        add handlers
    */
    socketService.on('shipper:choose:express', function(data) {

    });

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
            var dataShipper = {
                shipperID: currentUser.username,
                status: currentUser.workingstatusid
            };
            currentLocation = position.coords;
            dataShipper.latitude = position.coords.latitude;
            dataShipper.longitude = position.coords.longitude;

            socketService.emit("shipper:register:location",dataShipper);
        },function(){
            alert("Can't get your current location! Please check your connection");
        });
    };

    return api; 
}

socketShipper.$inject = ['socketService','authService'];
angular.module('app').factory('socketShipper', socketShipper);