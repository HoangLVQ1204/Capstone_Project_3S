


var _ = require('lodash');

module.exports = function(socket, io) {    
    io.addToRoom(socket, 'shipper');
    
    // Add shipper:disconnect for shipper to disconnect by himself
    socket.on('disconnect', function() {
        console.log('Shipper', socket.id, 'disconnect');
        var shipper = io.getShipperBySocketID(socket.id);
        var orders = io.getOrdersOfShipper(shipper.shipperID);
        orders.forEach(function(e) {
            e.orderInfo.isPending = true;
            io.updateOrder(e.orderID, e.orderInfo);
        });
        console.log('after disconnect', orders);
        io.removeShipper(shipper.shipperID);
        io.forward(
        {
            type: 'shipper',
            clientID: shipper.shipperID
        },
        [ { room: shipper.shipperID }, 'admin' ],
        {
            shipper: shipper
        },
        [ 'store:delete:shipper', 'admin:delete:shipper' ]);

        io.forward(
        {
            type: 'shipper',
            clientID: shipper.shipperID
        },
        [ { room: shipper.shipperID }, 'admin' ],
        {
            orders: orders
        },
        [ 'store:update:order', 'admin:update:order' ]);        
    });

    socket.on('shipper:disconnect', function() {        
    });
    
    socket.on('shipper:choose:express', function(data) {        
    	io.forward(data.sender, data.receiver, data.msg, 'store:find:shipper');
    });

    socket.on('shipper:update:location', function(data) {
        console.log('update loc', data);
        io.forward(data.sender, data.receiver, data.msg, ['admin:update:shipper', 'store:update:shipper']);
    });
    socket.on('shipper:sendissue', function(data) {
        console.log('socketShipper recieve socket send issue', data);
        console.log('quyen', data.receiver);
        io.forward(data.sender, data.receiver, data.msg, 'admin:issue');
    });
}