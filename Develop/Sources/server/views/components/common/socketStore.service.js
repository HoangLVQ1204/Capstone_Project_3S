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
        api.selectShipper(shipper, {});
    });

    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();
        
        var d = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position){
            // if (currentLocation
            //     && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
            //     && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
            //     console.log('the same location');
            //     return;
            // }
            // console.log('different location');
            var dataStore = {
                storeID: currentUser.stores[0],
                ownStore: currentUser.username            
            };
            currentLocation = position.coords;
            dataStore.latitude = position.coords.latitude;
            dataStore.longitude = position.coords.longitude;

            d.resolve(dataStore);
        },function(){
            d.reject("Can't get your current location! Please check your connection");            
        });
        return d.promise;
    };

    api.registerSocket = function(){
        api.getCurrentUser()
        .then(function(user) {
            mapService.addStore(user)
            .then(function() {
                socketService.emit("store:register:location",user);
            });            
        },function(){
            alert("Can't get your current location! Please check your connection");
        });            
    };
    
    api.findShipper = function() {                
        socketService.emit('store:find:shipper', null);
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