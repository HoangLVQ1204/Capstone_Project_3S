


module.exports = function(socket, io) {
    socket.join('shipper', function() {
        console.log(socket.id, 'joined room Shipper');
        console.log('Shipper Room', io.nsps['/'].adapter.rooms.shipper);
    })    
    
    socket.on('disconnect', function() {
        console.log('Shipper', socket.id, 'disconnect');
    })      
}