/**
 * Created by hoanglvq on 10/26/15.
 */


function socketAdmin(socketService,authService,mapService){

    var EPSILON = 1e-8;            

    var currentLocation = null;    

    var addHandlers = function() {
        socketService.on('admin:filter:shipper', function(data) {  
            mapService.googlemap.then(function(util) {                
                var store = mapService.getOneStore(data.storeID);
                var shippers = mapService.getShipperMarkers('all');                    
                util.getDistanceFromOneToMany([store], shippers)
                .then(function(distances) {
                    distances.forEach(function(distance, index) {
                        if (distance.value < data.filter.radius) {
                            console.log("RESULT DATA");
                            console.log(distance.value, shippers[index].status);
                        }
                    });                    
                })
            });
        });        
    };

    return {            
        registerSocket: function(nsp){                        
            var currentUser = authService.getCurrentInfoUser();
            addHandlers();

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
}


socketAdmin.$inject = ['socketService','authService','mapService'];

angular.module('app').factory('socketAdmin', socketAdmin);