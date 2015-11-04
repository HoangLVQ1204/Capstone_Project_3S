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

    socketService.on('admin:register:location', function(data) {
        console.log('register', data);
        mapService.setMapData(data.msg.mapData);
    });

    socketService.on('admin:add:shipper', function(data) {        
        mapService.addShipper(data.msg.shipper);
    });

    socketService.on('admin:add:store', function(data) {        
        mapService.addStore(data.msg.store);
    });

    socketService.on('admin:add:order', function(data) {                
        var msg = data.msg;
        mapService.addOrder(msg.orderID, msg.store, msg.shipper, msg.customer)
        .then(function() {
            console.log('admin add order', data);
        })
    });

    socketService.on('admin:update:shipper', function(data) {
        console.log('admin:update:shipper', data);
        var shipper = data.msg.shipper;
        mapService.updateShipper(shipper);
    });

    socketService.on('admin:delete:shipper', function(data) {
        console.log('admin:delete:shipper', data);
        var shipper = data.msg.shipper;
        mapService.deleteShipper(shipper.shipperID);
    });

    socketService.on('admin:update:order', function(data) {
        console.log('admin:update:order', data);
        var orders = data.msg.orders;
        orders.forEach(function(e) {
            mapService.updateOrder(e.orderID, e.orderInfo);
        });
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