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

    socketService.on('admin:add:shipper', function(data) {        
        mapService.addShipper(data.msg.shipper);
    });

    socketService.on('admin:add:store', function(data) {        
        mapService.addStore(data.msg.store);
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
    
    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();        
        // TODO: Change later
        currentUser.latitude = 21.028784;
        currentUser.longitude = 105.826088;

        var dataAdmin = {
            adminID: currentUser.username,
            latitude: currentUser.latitude,
            longitude: currentUser.longitude              
        };
        return dataAdmin;
    };

    api.registerSocket = function(){
        var user = api.getCurrentUser();                
        socketService.sendPacket(
        { 
            type: 'admin',
            clientID: user.adminID 
        },
        'server',
        {
            admin: user
        },
        'admin:register:location');        
    };

    return api;
}


socketAdmin.$inject = ['socketService','authService','mapService'];

angular.module('app').factory('socketAdmin', socketAdmin);