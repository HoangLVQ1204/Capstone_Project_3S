


module.exports = function(socket, io) {
	
    io.addToRoom(socket, 'admin');

    socket.on('disconnect', function() {

        console.log('Admin', socket.id, 'disconnect');
    });

    socket.on('admin:messageIssue', function(data) {
        data.msg.orderList.map(function (order) {
            //var msg = new Object();
            //msg['title'] = data.msg.msg;
            if (data.msg.categoryid == 1)
                data.msg.msg['content'] = "Your order " + order.orderid + " has been processed...";
            if (data.msg.categoryid == 3)
                data.msg.msg['content'] = "Your cancel request of order " + order.orderid + " has been accepted...";
            io.forward(
                {
                    type: 'admin',
                    clientID: data.sender
                },
                { type: 'store', clientID: order.storeid},
                {
                    msg: data.msg.msg
                },
                'store:issue:message')
        })

        console.log('Issue', data.msg);

    });

    socket.on('admin:message:confirmPayment', function(data) {

            //var msg = new Object();
            //msg['title'] = data.msg.msg;
            if (data.msg.categoryid == 1)
                data.msg.msg['content'] = "Your order " + order.orderid + " has been processed...";
            if (data.msg.categoryid == 3)
                data.msg.msg['content'] = "Your cancel request of order " + order.orderid + " has been accepted...";
            io.forward(
                {
                    type: 'admin',
                    clientID: data.sender
                },
                { type: 'store', clientID: order.storeid},
                {
                    msg: data.msg.msg
                },
                'store:message:confirmPayment');

        console.log('Payment confirmation', data.msg);

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