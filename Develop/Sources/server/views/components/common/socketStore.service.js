/**
 * Created by hoanglvq on 10/25/15.
 */


function socketStore($q,socketService,authService,mapService){

    var EPSILON = 1e-8;

    var currentLocation = null;
    var api = {};

    /*
        add handlers
    */
    socketService.on('store:find:shipper', function(shipper) {
        console.log('shipper returned', shipper);

        // Test selectShipper
        // api.selectShipper(shipper, {});
    });

    socketService.on('store:update:location', function(data) {
        mapService.updateShipper(data); 
    });

    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();        
        // TODO: Change later
        currentUser.latitude = 21.028784;
        currentUser.longitude = 105.826088;

        var dataStore = {
            storeID: currentUser.stores[0],
            latitude: currentUser.latitude,
            longitude: currentUser.longitude              
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
            'store:register:location');
            api.findShipper();
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
                socketID
            }
        */
        // TODO: update DB to get orderID

        // Fake data
        var orderID = 'order_1';
        customer.geoText = "Cát Linh,Ba Đình,Hà Nội,Việt Nam";
        customer.order = [orderID];

        mapService.addShipper(shipper)
        .then(function() {
            api.getCurrentUser()
            .then(function(user) {
                mapService.addOrder(orderID, shipper.shipperID, user.storeID);            
                mapService.addCustomer(customer);
            });        
        });              

        socketService.emit('store:choose:shipper', {
            shipper: shipper,
            customer: customer,
            orderID: orderID
        });
    };

    return api;        
};

socketStore.$inject = ['$q','socketService','authService','mapService'];
angular.module('app').factory('socketStore', socketStore);