


var _ = require('lodash');

module.exports = function(socket, io, app) {
    console.log('socketShipper.js');
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
        // io.disconnectedShippers[shipper.shipperID] = setTimeout(function(){
        //     console.log('issueManage.createIssueDisconnect', shipper.shipperID);
            issueManage.createIssueDisconnect(shipper.shipperID);
            // io.shipperIssueToStore(shipper.shipperID, true);
        // }, 150000);

        // io.shipperIssueToStore(shipper.shipperID, false);
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

    socket.on('shipper:update:haveIssue', function(data) {
        io.updateIssueForShipper(data.msg.shipper.shipperID, data.msg.shipper.haveIssue);
        console.log(io.getOneShipper(data.msg.shipper.shipperID));
    });

    socket.on('shipper:reject:order', function(data) {
        var shipper = data.msg.shipper;
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