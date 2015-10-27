


module.exports = function(socket, io) {
    socket.join('shipper', function() {
        console.log('one joined room Shipper');
    })
    console.log('Shipper', Object.keys(io.to('shipper').connected));
    
    socket.on('disconnect', function() {
        console.log('Shipper', socket.id, 'disconnect');
    })      
}