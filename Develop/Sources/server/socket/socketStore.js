


module.exports = function(socket, io) {
	socket.join('store', function() {
        console.log(socket.id, 'joined room Store');
        console.log('Store Room', io.nsps['/'].adapter.rooms.store);
    }); 

    socket.on('disconnect', function() {
        console.log('Store', socket.id, 'disconnect');
        delete io.listStore[socket.id];
    });

    socket.on('store:find:shipper', function(data) {
        var filter = {
            // ban kinh (m)
            // trang thai shipper  0: free, 1: busy
            radius: 1000,
            status: 0,
            limit: 2
        };        
        io.to('admin').emit('admin:filter:shipper', {
            filter: filter,
            storeID: io.listStore[socket.id].storeID
        });
    });

    socket.on('store:choose:shipper', function(data) {
        var orderID = data.orderID;        
        socket.join(data.shipper.socketID, function() {
            console.log('store', socket.id, 'join room of shipper', data.shipper.socketID);
        });

        io.to('admin').emit('admin:update:order', {
            orderID: orderID,
            shipperID: data.shipper.shipperID,
            storeID: io.listStore[socket.id].storeID,
            customer: data.customer
        });

        io.sockets.connected[data.shipper.socketID].emit('shipper:update:order', {
            orderID: orderID,
            shipperID: data.shipper.shipperID,
            store: io.listStore[socket.id],
            customer: data.customer
        });
    });
}