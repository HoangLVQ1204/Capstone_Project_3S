




var config   = require('../config/config');
var _ = require('lodash');

module.exports = function(socket, io) {
	io.addToRoom(socket, 'store');

    socket.on('disconnect', function() {
        console.log('Store', socket.id, 'disconnect');
    });

    socket.on('store:find:shipper', function(data) {
        console.log('socketStore:18 pendingShippers', io.pendingShippers);
        var numShippers = io.getAllShippers();
        var numShippers = numShippers.filter(function(shipper) {
            return !io.pendingShippers[shipper.shipperID];
        });

        if(numShippers.length != 0){
            io.gmapUtil.getClosestShippers(data.msg.store, numShippers, config.filter)
                .then(function(results) {
                    if(results.length == 0){
                        console.log("---ERROR CASE: NO SHIPPER IN FILTER---");
                        io.reply(
                            data.sender,
                            {
                                shipper: false
                            },
                            'store:find:shipper');
                    }else{
                        results.forEach(function(e) {
                            console.log("---SUCCESS: FINDED SHIPPERS---");
                            io.pendingShippers[e.shipperID] = data.msg.store;
                            io.forward(
                                data.sender,
                                {
                                    type: 'shipper',
                                    clientID: e.shipperID
                                },
                                {
                                    distanceText: e.distanceText,
                                    durationText: e.durationText
                                },
                                'shipper:choose:express'
                            );
                        });
                    }
                }).catch(function(error){
                    console.log("---ERROR CASE: FILTER ERROR. NO SHIPPER IN FILTER---");
                    io.reply(
                        data.sender,
                        {
                            shipper: false
                        },
                        'store:find:shipper'
                    );
                })
        }else{
            console.log("--ERROR CASE: NO SHIPPER IN IO LIST--");
            io.reply(
                data.sender,
                {
                    shipper: false
                },
                'store:find:shipper');
        }
    });

    socket.on('store:remove:express', function(data) {
        var shipperMsg = {
            store: _.clone(data.msg.store, true)
        };        
        io.notifyPendingShippers(data.msg.store.storeID, '', data.sender, shipperMsg);
        io.removePendingShippersOfStore(data.msg.store.storeID);
    });

    socket.on('store:choose:shipper', function(data) {
        console.log('choose shipper', data);
        var sender = data.sender;
        var receiver = data.receiver;
        var msg = data.msg;

        io.forward(sender, receiver, msg, 'shipper:add:order');
        io.addOrder(msg.orderID, msg.store, msg.shipper, msg.customer)
        .then(function() {
            io.updateNumTasksByShipperID(msg.shipper.shipperID);            
            // notify other shippers
            var shipperMsg = {
                store: _.clone(msg.store, true)
            };        
            console.log('socketStore:90 pendingShippers', io.pendingShippers);
            io.notifyPendingShippers(msg.store.storeID, msg.shipper.shipperID, data.sender, shipperMsg);
            io.removePendingShippersOfStore(msg.store.storeID);
            console.log('pendingShippers', io.pendingShippers);

            io.addToRoom(socket, msg.shipper.shipperID);    

            console.log('total data:shippers', io.shippers);    
            console.log('total data:stores', io.stores);    
            console.log('total data:customers', io.customers);    
            console.log('total data:orders', io.orders);            
        });
    });
}