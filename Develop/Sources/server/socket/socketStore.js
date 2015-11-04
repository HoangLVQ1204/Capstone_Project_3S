




var gmapUtil = require('./googlemapUtil');


module.exports = function(socket, io) {
	io.addToRoom(socket, 'store');

    socket.on('disconnect', function() {
        console.log('Store', socket.id, 'disconnect');        
    });

    socket.on('store:find:shipper', function(data) {
        var filter = {
            // ban kinh (m)
            // trang thai shipper  0: free, 1: busy
            radius: 1000000000,
            status: 1,
            limit: 2
        };        
                
        gmapUtil.getClosestShippers(data.msg.store, io.getAllShippers(), filter)
        .then(function(results) {
            console.log('closest shippers', results);            
            results.forEach(function(e) {
                // console.log('forward', data.sender);
                io.forward(
                data.sender,
                {
                    type: 'shipper',
                    clientID: e.shipperID
                },
                {
                    distanceText: e.distanceText
                },                
                'shipper:choose:express');
            });
        });      
    });

    socket.on('store:choose:shipper', function(data) {
        console.log('choose shipper', data);
        var sender = data.sender;
        var receiver = data.receiver;
        var msg = data.msg;

        io.addOrder(msg.orderID, msg.store.storeID, msg.shipper.shipperID);
        io.updateOrderOfShipper(msg.shipper.shipperID, msg.orderID);
        io.updateOrderOfStore(msg.store.storeID, msg.orderID);
        io.addCustomer(msg.customer);

        io.forward(data.sender, data.receiver, data.msg, 'shipper:add:order');
        io.forward(data.sender, 'admin', data.msg, 'admin:add:order');

        io.addToRoom(socket, msg.shipper.shipperID);    

        console.log('total data:shippers', io.shippers);    
        console.log('total data:stores', io.stores);    
        console.log('total data:customers', io.customers);    
        console.log('total data:orders', io.orders);            
    });
}