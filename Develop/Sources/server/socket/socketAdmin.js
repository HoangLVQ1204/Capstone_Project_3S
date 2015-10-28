


module.exports = function(socket, io) {
	socket.join('admin', function() {
        console.log(socket.id, ' : joined room Admin');
        console.log('Admin Room', io.nsps['/'].adapter.rooms.admin);        
    })      

    socket.on('disconnect', function() {
        console.log('Admin', socket.id, 'disconnect');
    })	
}