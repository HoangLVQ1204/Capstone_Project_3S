/**
 * Created by hoanglvq on 10/26/15.
 */


function socketAdmin(socketService,authService,mapService){

    var EPSILON = 1e-8;            

    var currentLocation = null;    
    var api = {};
    /*
        add handlers
    */
    socketService.on('admin:filter:shipper', function(data) {  
        // var storeID = "store_3";
        // var newStore = {
        //     "order": [],
        //     "latitude": 21.031526,
        //     "longitude": 105.813359,
        //     "storeID": storeID
        // };
        // mapService.addStore(newStore);
        mapService.googlemap.then(function(util) {                
            var store = mapService.getOneStore(data.storeID);                

            // get shippers based on working status
            var shippers = mapService.getShipperMarkers('all');                    

            util.getDistanceFromOneToMany([store], shippers)
            .then(function(distances) {                    
                distances = distances.sort(function(e1, e2) {
                    return e1.distance.value - e2.distance.value;
                });
                distances = distances.slice(0, data.filter.limit);
                var result = distances.map(function(e) {
                    return {
                        distance: e.distance.text,
                        socketID: shippers[e.id].socketID
                    }
                });                
                socketService.emit('admin:filter:shipper', {
                    storeSocket: store.socketID,
                    shippers: result
                });
            });
        });
    });        

    socketService.on('admin:add:shipper', function(shipper) {                
        mapService.addShipper(shipper);
    });

    socketService.on('admin:add:store', function(store) {        
        mapService.addStore(store);
    }); 

    socketService.on('admin:update:order', function(data) {        
        data.customer.order = [data.orderID];
        // strict order
        mapService.addOrder(data.orderID, data.shipperID, data.storeID);
        mapService.addCustomer(data.customer);
    });

    socketService.on('admin:update:shipper', function(data) {
        mapService.updateShipper(data);
    });
    

    api.registerSocket = function(){                        
        var currentUser = authService.getCurrentInfoUser();            
        
        navigator.geolocation.getCurrentPosition(function(position){
            var dataAdmin = {
                username: currentUser.username
            };
            // if (currentLocation
            //     && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
            //     && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
            //     console.log('the same location');
            //     return;
            // }
            // console.log('different location');
            currentLocation = position.coords;
            dataAdmin.latitude = position.coords.latitude;
            dataAdmin.longitude = position.coords.longitude;

            socketService.emit("admin:register:location",dataAdmin);            
        },function(){
            alert("Can't get your current location! Please check your connection");
        });
    };

    return api;
}


socketAdmin.$inject = ['socketService','authService','mapService'];

angular.module('app').factory('socketAdmin', socketAdmin);