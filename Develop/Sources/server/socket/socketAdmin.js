


module.exports = function(socket, io) {
	
    io.addToRoom(socket, 'admin');

    socket.on('disconnect', function() {

        console.log('Admin', socket.id, 'disconnect');
    });

    // socket.on('admin:filter:shipper', function(data) {
    // 	data.shippers.forEach(function(shipper) {    		
    // 		io.sockets.connected[shipper.socketID].emit('shipper:choose:express', {
    // 			distance: shipper.distance,
    // 			storeSocket: data.storeSocket
    // 		});
    // 	});  	
    // });
}