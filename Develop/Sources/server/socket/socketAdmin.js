


module.exports = function(socket, io) {
	
    io.addToRoom(socket, 'admin');

    socket.on('disconnect', function() {

        console.log('Admin', socket.id, 'disconnect');
    });

    socket.on('admin:messageIssue', function(data) {
        data.msg.orderList.map(function (order) {
            //var msg = new Object();
            //msg['title'] = data.msg.msg;
            var socketName = "" ;
            if (data.msg.typeid == 1 || data.msg.typeid == 2 || data.msg.typeid == 3 || data.msg.typeid == 6)
            {
                data.msg.msg['content'] = "Pending problem of your order " + order.orderid + " has been resolved...";
                socketName =  'store:issue:pending';
            }
            if (data.msg.typeid == 4)
            {
                data.msg.msg['content'] = "Your order " + order.orderid + " has a trouble, KarryWell will call to you as soon as possible...";
                socketName =  'store:issue:cancel';
            }
            if (data.msg.typeid == 5)
            {
                data.msg.msg['content'] = "Your order " + order.orderid + " can't find your customer, please call to your customer...";
                socketName =  'store:issue:cancel';
            }
            if (data.msg.type == 7)
            {
                data.msg.msg['content'] = "Your cancel request of order " + order.orderid + " has been accepted...";
                socketName =  'store:issue:cancel';
            }


            io.forward(
                {
                    type: 'admin',
                    clientID: data.sender
                },
                { type: 'store', clientID: order.storeid},

                    data.msg.msg
                ,
                socketName);
        })

        //send to shipper
        if (data.msg.typeid <= 6)
            data.msg.msg['content'] = 'Your pending issue has been resolved';

        if (data.msg.typeid == 7)
            data.msg.msg['content'] = "Order " + order.orderid + " has been cancel by store...";
            data.msg.msg['url'] = '#';
        io.forward(
            {
                type: 'admin',
                clientID: data.sender
            },
            { type: 'shipper', clientID: data.msg.shipperid},
            {
                notification: data.msg.msg,
                type: data.msg.typeid
            },
            'shipper:issue:resolve')
        console.log('Issue', data.msg);

    });

    socket.on('admin:message:confirmPayment', function(data) {

            io.forward(
                {
                    type: 'admin',
                    clientID: data.sender
                },
                { type: 'store', clientID: data.msg.storeid},
                  data.msg.msg,
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