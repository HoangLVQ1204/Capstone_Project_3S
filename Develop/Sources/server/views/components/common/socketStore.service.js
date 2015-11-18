/**
 * Created by hoanglvq on 10/25/15.
 */


function socketStore($q,socketService,authService,mapService, $rootScope){

    var EPSILON = 1e-8;

    var currentLocation = null;
    var api = {};

    /*
        add handlers
    */

    
    socketService.on('store:register:location', function(data) {
        mapService.setMapData(data.msg.mapData)
        .then(function() {
            console.log('register', data);
        });
    });


    socketService.on('store:update:shipper', function(data) {
        console.log('store:update:shipper', data);
        var shipper = data.msg.shipper;
        mapService.updateShipper(shipper);
    });

    socketService.on('store:delete:shipper', function(data) {
        var shipper = data.msg.shipper;
        mapService.deleteShipper(shipper.shipperID);
    });

    socketService.on('store:update:order', function(data) {
        console.log('store:update:order', data);
        var orders = data.msg.orders;
        orders.forEach(function(e) {
            mapService.updateOrder(e.orderID, e.orderInfo);
        });
        console.log('after update', mapService.getOrders());
    });

    socketService.on('shipper:change:order:status', function(data) {
        console.log(data);
        $rootScope.$emit("evChange", data);
        $rootScope.notify(data.msg);
        data['message'] = data.msg.content;

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

        mapService.addStore(user)
        .then(function() {                
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
        });
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

    api.selectShipper = function(shipper, customer) {
        /*
            customer = {
                geoText
            }

            shipper = {
                ....                
            }
        */
        // TODO: update DB to get orderID

        // Fake data
        var orderID = 'order_1';
        customer.geoText = "Cát Linh,Ba Đình,Hà Nội,Việt Nam";
        customer.order = [orderID];

        mapService.addShipper(shipper)
        .then(function() {            
            return api.getCurrentUser();
        })
        .then(function(user) {
            mapService.addOrder(orderID, user, shipper, customer)
            .then(function() {
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
            });            
        });        
    };

    return api;        
};

socketStore.$inject = ['$q','socketService','authService','mapService','$rootScope'];
angular.module('app').factory('socketStore', socketStore);