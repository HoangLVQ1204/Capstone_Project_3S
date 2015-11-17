/**
 * Created by hoanglvq on 10/26/15.
 */


function socketAdmin(socketService,authService,mapService, $rootScope){

    var EPSILON = 1e-8;            

    var currentLocation = null;    
    var api = {};
    /*
        add handlers
    */
    
    socketService.on('admin:register:location', function(data) {

        mapService.setMapData(data.msg.mapData)
        .then(function() {
                console.log('register', data);
            });

        $rootScope.onlineShipper = 0;
        //$rootScope.$apply();
        data.msg.shipperList.map(function (shipper) {
            if (shipper.isConnected) $rootScope.onlineShipper++;
        });

    });

    socketService.on('admin:add:shipper', function(data) {   
        console.log('admin:add:shipper', data);          
        mapService.addShipper(data.msg.shipper);
        $rootScope.$emit("admin:dashboard:getShipperList", data.msg.shipperList);
    });

    socketService.on('admin:add:store', function(data) { 
        // console.log('admin:add:store', data);       
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
        $rootScope.$emit("admin:dashboard:getShipperList", data.msg.shipperList);
    });

    socketService.on('admin:update:order', function(data) {
        console.log('admin:update:order', data);
        var orders = data.msg.orders;
        orders.forEach(function(e) {
            mapService.updateOrder(e.orderID, e.orderInfo);
        });
    });

    socketService.on('admin:issue', function(data) {
        console.log('admin:issue', data.msg.issue.issueid);
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
        socketService.authenSocket();
        var user = api.getCurrentUser();
        // console.log('registerSocket', user);
        socketService.sendPacket(
        {
            type: 'admin',
            clientID: user.adminID
        },
        'server',
        {
            admin: user
        },
        'client:register');
    };



    return api;
}


socketAdmin.$inject = ['socketService','authService','mapService', '$rootScope'];

angular.module('app').factory('socketAdmin', socketAdmin);