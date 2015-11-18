


module.exports = function(socket, io) {
	
    io.addToRoom(socket, 'admin');

    socket.on('disconnect', function() {

        console.log('Admin', socket.id, 'disconnect');
    });

    socket.on('admin:messageIssue', function(data) {
        data.msg.orderList.map(function (order) {
            var msg = new Object();
            //msg['title'] = data.msg.msg;
            io.forward(
                {
                    type: 'admin',
                    clientID: data.sender
                },
                { type: 'store', clientID: order.storeid},
                {
                    message: data.msg.msg
                },
                 'store:issue:message')
        })

        io.forward(
            {
                type: 'admin',
                clientID: data.sender
            },
            { type: 'shipper', clientID: data.msg.shipperid},
            {
                message: data.msg.msg
            },
             'shipper:issue:message')

        console.log('Issue', data.msg);

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