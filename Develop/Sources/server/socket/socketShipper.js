


var _ = require('lodash');

module.exports = function(socket, io) {    
    io.addToRoom(socket, 'shipper');
    
    // Add shipper:disconnect for shipper to disconnect by himself
    socket.on('disconnect', function() {
        console.log('Shipper', socket.id, 'disconnect');        
        
    });

    socket.on('shipper:disconnect', function() {
        
    });
    
    socket.on('shipper:choose:express', function(data) {        
    	io.forward(data.sender, data.receiver, data.msg, 'store:find:shipper');
    });

    socket.on('shipper:update:location', function(data) {
        console.log('update loc', data);
        io.forward(data.sender, data.receiver, data.msg, ['admin:update:shipper', 'store:update:shipper']);
    });
}