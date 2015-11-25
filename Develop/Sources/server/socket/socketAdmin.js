


module.exports = function(socket, io, app) {
	
    io.addToRoom(socket, 'admin');
    var notificationManage = require('../manages/notificationManage')(app);

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

            data.msg.msg['username'] = order.storeid;
            notificationManage.postFromSever(data.msg.msg);
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
        console.log(data.msg.orderList[0].orderid);
        if (data.msg.typeid == 7)
            data.msg.msg['content'] = "Order " + data.msg.orderList[0].orderid + " has been cancel by store...";
        if (data.msg.typeid == 8)
            data.msg.msg['content'] = "Reconnect successfully";
        data.msg.msg['username'] = data.msg.shipperid;
        data.msg.msg['url'] = '#';
        notificationManage.postFromSever(data.msg.msg);


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
        data.msg.msg['username'] = data.msg.storeid;
        notificationManage.postFromSever(data.msg.msg);
        console.log('Payment confirmation', data.msg);

    });

    socket.on('admin:notification:blockStore', function(data) {

        data.msg.msg['username'] = data.msg.storeid;
        notificationManage.postFromSever(data.msg.msg);

        io.forward(
            {
                type: 'admin',
                clientID: data.sender
            },
            { type: 'store', clientID: data.msg.storeid},
            data.msg.msg,
            'store:notification:blockStore');

        console.log('Block store', data.msg);

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