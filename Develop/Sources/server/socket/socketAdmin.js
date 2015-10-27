


module.exports = function(socket, io) {
	socket.join('admin', function() {
        console.log('one joined room Admin');
    })
    console.log('Admin', Object.keys(io.to('admin').connected));    

    socket.on('disconnect', function() {
        console.log('Admin', socket.id, 'disconnect');
    })	
}