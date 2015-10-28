


module.exports = function(socket, io) {
    socket.join('shipper', function() {
        console.log(socket.id, 'joined room Shipper');
        console.log('Shipper Room', io.nsps['/'].adapter.rooms.shipper);
    });   
    
    socket.on('disconnect', function() {
        console.log('Shipper', socket.id, 'disconnect');        
        delete io.listShipper[socket.id];        
    });
    
    socket.on('shipper:choose:express', function(data) {    	
    	console.log('accept', data.socketID);
    	data.shipper.socketID = socket.id;
    	io.sockets.connected[data.socketID].emit('store:find:shipper', data.shipper);
    });
}