


module.exports = function(socket, io) {
	socket.join('store', function() {
        console.log(socket.id, 'joined room Store');
        console.log('Store Room', io.nsps['/'].adapter.rooms.store);
    })  

    socket.on('disconnect', function() {
        console.log('Store', socket.id, 'disconnect');
    })

    socket.on('store:find:shipper', function(data) {
        var filter = {
            // ban kinh (m)
            // trang thai shipper  0: free, 1: busy
            radius: 1000,
            status: 0,
            limit: 2
        };        
        io.in('admin').emit('admin:filter:shipper', {
            filter: filter,
            storeID: io.listStore[socket.id].storeID
        });
    })
}