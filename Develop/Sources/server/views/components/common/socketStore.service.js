/**
 * Created by hoanglvq on 10/25/15.
 */


function socketStore($q,socketService,authService,mapService,$rootScope){

    var EPSILON = 1e-8;

    var currentLocation = null;
    var api = {};

    /*
        add handlers
    */

    
    socketService.on('store:register:location', function(data) {        
        // console.log('register', mapService.setMapData, data.msg.mapData);
        mapService.setMapData(data.msg.mapData);
    });

    socketService.on('shipper:change:order:status', function(data) {
        $rootScope.$emit("updateStatusOrder", data);
        $rootScope.notify(data.msg);
        data['message'] = data.msg.content;
    });

    socketService.on('store:issue:pending', function(data) {
        console.log('store:issue:pending', data);
        $rootScope.$emit("updatePendingOrder", data.msg);
        $rootScope.notify(data.msg, 1);
    });

    socketService.on('store:issue:cancel', function(data) {
        console.log('store:issue:cancel', data);
        $rootScope.$emit("updatePendingOrder", data.msg);
        $rootScope.notify(data.msg);
    });

    socketService.on('store:issue:continue', function(data) {
         $rootScope.$emit("updatePendingOrder", data.msg);
         $rootScope.notify(data.msg, 1);
    });

    socketService.on('store:message:confirmPayment', function(data) {
        $rootScope.$emit("store:message:confirmPayment", data.msg);
        $rootScope.notify(data.msg);
    });

    socketService.on('store:notification:blockStore', function(data) {
        $rootScope.$emit("logoutStore", data.msg);
    });

    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();
        var dataStore = {
            storeID: currentUser.stores[0].storeid,
            latitude: parseFloat(currentUser.stores[0].latitude),
            longitude: parseFloat(currentUser.stores[0].longitude)
        };
        return dataStore;
    };

    api.registerSocket = function(){
        var user = api.getCurrentUser();
        socketService.sendPacket(
        { 
            type: 'store',
            clientID: user.storeID 
        },
        'server',
        {
            store: user
        },
        'client:register');
    };
    
    api.findShipper = function() {
        console.log('find shipper');
        var user = api.getCurrentUser();
        socketService.sendPacket(
        {
            type: 'store',
            clientID: user.storeID
        },
        'shipper',
        {
            store: user
        },
        'store:find:shipper');
    };

    api.selectShipper = function(shipper, customer, orderID) {
        customer.order = [orderID];

        var user = api.getCurrentUser();        
        socketService.sendPacket(
        {
            type: 'store',
            clientID: user.storeID
        },
        {
            type: 'shipper',
            clientID: shipper.shipperID
        },
        {
            orderID: orderID,
            shipper: shipper,
            store: user,
            customer: customer
        },
        'store:choose:shipper');
    };

    api.cancelExpress = function() {
        var user = api.getCurrentUser();
        socketService.sendPacket(
        {
            type: 'store',
            clientID: user.storeID
        },
        'server',
        {
            store: user
        },
        'store:remove:express');
    }
    return api;        
};

socketStore.$inject = ['$q','socketService','authService','mapService','$rootScope'];
angular.module('app').factory('socketStore', socketStore);