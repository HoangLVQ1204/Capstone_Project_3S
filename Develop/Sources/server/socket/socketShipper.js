


var _ = require('lodash');

module.exports = function(socket, io, app) {
    io.addToRoom(socket, 'shipper');

    var issueManage = require('../manages/issueManage')(app);

    // Add shipper:disconnect for shipper to disconnect by himself
    socket.on('disconnect', function() {
        console.log('Shipper', socket.id, 'disconnect');

        var shipper = io.getShipperBySocketID(socket.id);

        if (!shipper) return;
        io.disconnectShipper(shipper.shipperID);
        var orders = io.getOrdersOfShipper(shipper.shipperID);
        orders.forEach(function(e) {
            e.orderInfo.isPending = true;
            io.updateOrder(e.orderID, e.orderInfo);
        });
        console.log('after disconnect', orders);

        //Create Issue Disconnected
        issueManage.createNewIssue(shipper.shipperID);

        io.disconnectShipper(shipper.shipperID);
    });

    socket.on('shipper:disconnect', function() {        
        console.log('check disconnect', socket.disconnect);
    });
    
    socket.on('shipper:choose:express', function(data) {
        if (io.pendingShippers[data.msg.shipper.shipperID]) {
            io.forward(data.sender, data.receiver, data.msg, 'store:find:shipper');
        } else {
            console.log('dont exist in pendingShippers');
        }
    });

    socket.on('shipper:update:location', function(data) {
        console.log('update loc', data);
        io.updateLocationShipper(data.msg.shipper);
    });

    socket.on('shipper:update:status', function(data) {
        var shipper = io.getOneShipper(data.msg.shipperID);
        io.updateStatusShipper(shipper);
    });

    socket.on('shipper:reject:order', function(data) {
        var shipper = data.msg.shipper;
        console.log('shipper reject order', shipper);
        var storeID = io.pendingShippers[shipper.shipperID].storeID;
        io.removePendingShipper(shipper.shipperID);        
        if (io.getNumberPendingShippersOfStore(storeID) == 0) {
            io.reply(
                {
                    type: 'store',
                    clientID: storeID
                },
                {
                    shipper: false
                },
                'store:find:shipper');
        }
    });
}