


module.exports = function(socket, io, app) {
    console.log('socketAdmin.js');	
    io.addToRoom(socket, 'admin');
    var notificationManage = require('../manages/notificationManage')(app);
    var db = app.get('models');
    socket.on('disconnect', function() {
        console.log('Admin', socket.id, 'disconnect');
    });

    socket.on('admin:messageIssue', function(data) {
        var promises = data.msg.orderList.map(function (order) {
            //var msg = new Object();
            //msg['title'] = data.msg.msg;
            var socketName = "";
            if (data.msg.typeid == 1 || data.msg.typeid == 2 || data.msg.typeid == 3 || data.msg.typeid == 6) {
                data.msg.msg['content'] = "Pending problem of your order " + order.orderid + " has been resolved...";
                socketName = 'store:issue:pending';
            }
            if (data.msg.typeid == 4) {
                data.msg.msg['content'] = "Your order " + order.orderid + " has a trouble, KarryWell will call to you as soon as possible...";
                socketName = 'store:issue:cancel';
            }
            if (data.msg.typeid == 5) {
                data.msg.msg['content'] = "Your order " + order.orderid + " can't find your customer, please call to your customer...";
                socketName = 'store:issue:cancel';
            }
            if (data.msg.typeid == 7) {
                data.msg.msg['content'] = "Your cancel request of order " + order.orderid + " has been accepted...";
                socketName = 'store:issue:cancel';
            }
            //console.log(socketName, '0000');
            return db.managestore.getOwnerOfStore(order.storeid)
                .then(function (user) {
                    data.msg.msg['username'] = user[0].managerid;
                    notificationManage.postFromSever(data.msg.msg);
                    console.log(socketName, 'AAA');
                    return { storeID: order.storeid, socketName: socketName };                    
                })
        });

        Promise.all(promises)
        .then(function(infos) {            
            var unique = {};
            // console.log('socketAdmin.js:47', data);
            infos.forEach(function(e) {
                if (unique[e.storeID]) unique[e.storeID][e.socketName] = 1;
                else {
                    var temp = {};
                    temp[e.socketName] = 1;
                    unique[e.storeID] = temp;
                }
            });
            var storeIDs = Object.keys(unique);            
            // console.log('socketAdmin.js:57', storeIDs);
            storeIDs.forEach(function(storeID) {
                Object.keys(unique[storeID]).forEach(function(socketName) {
                    // console.log('socketAdmin.js:60', storeID, socketName);
                    io.forward(
                        data.sender,
                        {type: 'store', clientID: storeID },
                        data.msg.msg,
                        socketName);
                });
            });
        });

        //send to shipper
        if (data.msg.typeid <= 6)
            data.msg.msg['content'] = 'Your issue has been resolved';
        //console.log(data.msg.orderList[0].orderid,'BBB');
        if (data.msg.typeid == 7)
            data.msg.msg['content'] = "Order " + data.msg.orderList[0].orderid + " has been cancel by store...";
        if (data.msg.typeid == 8)
            data.msg.msg['content'] = "Reconnect successfully";
        data.msg.msg['username'] = data.msg.shipperid;
        data.msg.msg['url'] = '#';
        notificationManage.postFromSever(data.msg.msg);
        io.updateIssueForShipper(data.msg.shipperid, false);
        if (data.msg.newShipperID) {
            io.updatePendingOrder(data.msg.newShipperID, false);
        }
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
        //console.log('Issue', data.msg);

    });

    socket.on('admin:message:confirmPayment', function(data) {
        db.managestore.getOwnerOfStore(data.msg.storeid)
            .then(function (user) {
                data.msg.msg['username'] = user[0].managerid;
                notificationManage.postFromSever(data.msg.msg);
                io.forward(
                    {
                        type: 'admin',
                        clientID: data.sender
                    },
                    {type: 'store', clientID: data.msg.storeid},
                    data.msg.msg,
                    'store:message:confirmPayment');
                data.msg.msg['username'] = data.msg.storeid;
                notificationManage.postFromSever(data.msg.msg);
            });

    });

    socket.on('admin:notification:blockStore', function(data) {
        db.managestore.getOwnerOfStore(data.msg.storeid)
            .then(function (user) {
                data.msg.msg['username'] = user[0].managerid;
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


    });

    socket.on('admin:notification:newTask', function(data) {
            data.msg.shipperList.map(function (shipperid) {
                io.forward(
                    {
                        type: 'admin',
                        clientID: data.sender
                    },
                    { type: 'shipper', clientID: shipperid},
                    data.msg.msg,
                    'shipper:notification:newTask');
                console.log('New Task', data.msg);
            });
            })

}