


module.exports = function(socket, io) {
	socket.join('store', function() {
        console.log('one joined room Store');
    })
    console.log('Store', Object.keys(io.to('store').connected));    

    socket.on('disconnect', function() {
        console.log('Store', socket.id, 'disconnect');
    })
}