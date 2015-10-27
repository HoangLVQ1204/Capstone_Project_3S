


module.exports = function(socket, io) {

	socket.join('admin', function() {
        console.log(socket.id, 'joined room Admin');
        console.log('Admin Room', io.nsps['/'].adapter.rooms.admin);        
    });     

    socket.on('disconnect', function() {
        console.log('Admin', socket.id, 'disconnect');
    });

    socket.on('admin:filter:shipper', function(data) {
    	data.shippers.forEach(function(shipper) {    		
    		io.sockets.connected[shipper.socketID].emit('shipper:choose:express', {
    			distance: shipper.distance,
    			storeSocket: data.storeSocket
    		});
    	});  	
    });
}