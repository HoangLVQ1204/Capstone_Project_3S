/**
 * Created by hoanglvq on 10/26/15.
 */

/*
    TODO: Bug scenario for Shipper (similar to Store)
    - Browser 1: Sign out. Then Sign in as Admin. Go to /mapdemo
    - Browser 2: Sign out. Then Sign in as Shipper. Go to /mapdemo
    - Check whether /mapdemo in Admin and Shipper show same position of shipper

    Cause: Shipper sent client:register, but it is rejected. Socketiojwt maybe only check token 1 time
    Resolve: Refresh Shipper tab to reconnect

    Possible solution: https://auth0.com/blog/2014/01/15/auth-with-socket-io/
*/


/*
    TODO: notifications
    - list of notifications    
    - notificationService.js
        + client-2-server
        data {

            notification:
                {
                    type: ['issue', 'info']
                    title:
                    content:
                    url:
                    notify: true/false
                }

        }

        + server-2-client
        {
            message: {
                    type: ['issue', 'info']
                    content:
                    url:
                    notify: true/false
                }            
        }        
    - directives: ...

*/
var _ = require('lodash');

module.exports = function(server,app){
    
    var socketConnection = {};    

    var io = require('socket.io')(server);
    var socketioJwt = require("socketio-jwt");
    var config      = require('../config/config');

    /*
        io.admins[adminID] = {            
            socketID,
            latitude,
            longitude   
        }
    */
    io.admins = {};

    io.containAdmin = function(adminID) {
        return !!io.admins[adminID];
    };

    io.updateAdmin = function(admin, socket) {
        io.admins[admin.adminID].latitude = admin.latitude;
        io.admins[admin.adminID].longitude = admin.longitude;
        io.admins[admin.adminID].socketID = socket.id;
    };

    io.addAdmin = function(admin, socket) {
        io.admins[admin.adminID] = {            
            latitude: admin.latitude,
            longitude: admin.longitude,
            socketID: socket.id            
        };              
    };

    /*
        io.stores[storeID] = {
            order: [],
            socketID,
            latitude,
            longitude            
        }
    */
    io.stores = {};

    /*
        io.shippers[shipperID] = {
            order: [],
            socketID,
            latitude,
            longitude,
            isConnected,
            numTasks
        }
    */ 
    io.shippers = {};

    /*
        io.customers[i] = {
            order: [],
            geoText
        }
    */
    io.customers = [];

    /*
        io.orders[orderID] = {
            shipperID,
            storeID,
            status: ["Waiting"  // dont' use
                    "Picking up"
                    "Bring to stock"
                    "In stock"
                    "Delivering"
                    "Done"
                    "Canceling"
                    "Cancel"],
            isPending
        }
    */
    io.orders = {};

    // Returns socket by receiver type
    io.receiverSocket = function(receiver) {        
        if (receiver === 'admin' || receiver === 'shipper' || receiver === 'store') {
            return io.to(receiver);
        }
        if (receiver.room) {
            console.log('Receiver Room ' + receiver.room, io.nsps['/'].adapter.rooms[receiver.room]);
            return io.in(receiver.room);
        }
        if (receiver.clientID) {    // clientID = shipperID || storeID            
            var socketID = '';

            if (receiver.type === 'shipper') {
                if(io.shippers[receiver.clientID]) socketID = io.shippers[receiver.clientID].socketID;
            } else if (receiver.type == 'store') {

                if(io.stores[receiver.clientID]) socketID = io.stores[receiver.clientID].socketID;
            } else if (receiver.type == 'admin') {
                if(io.admins[receiver.clientID]) socketID = io.admins[receiver.clientID].socketID;
            }
            return io.sockets.connected[socketID];
        }        
    };

    /*
        receiver = { type: xxx, clientID: xxx}
        msg = Object
    */
    io.reply = function(receiver, msg, eventName, callback) {
        var reply = {
            sender: 'server',
            receiver: receiver,
            msg: msg
        };        
        io.receiverSocket(receiver).emit(eventName, reply, callback);
    };

    /*
        sender: { type: xxx, clientID: xxx }
        receiver = 'admin' || 'shipper' || 'store' || {room: ...} || { type: 'store', clientID: storeid } || Arrays of these types [ 'admin', { room: ...} ]
        msg = Object
        eventName = String || Array of Strings
    */
    io.forward = function(sender, receiver, msg, eventName, callback) {
        var data = {
            sender: sender,            
            msg: msg
        };

        var listEvents = [].concat(eventName);
        [].concat(receiver).forEach(function(type, index) {     
            data.receiver = type;
            var connection = io.receiverSocket(type);
            if(connection) connection.emit(listEvents[index], data, callback);
        });        
    }

    // var distanceFrom = function(currentPosition,shippers,distanceRadius){

    // };

    // var findShipper = function(socket, data){
    //     var shippersNearest = {};        
    // };

    io.getDataForStore = function(storeID) {
        // Returns data for map of storeID
        // Based on io.stores, io.shippers, io.customers, io.orders
        var result = {};
        result.shipper = [];
        result.store = [];
        result.customer = [];
        result.orders = {};

        var store = io.getOneStore(storeID);
        result.store.push(store);
        store.order.forEach(function(orderID) {            
            result.orders[orderID] = _.clone(io.orders[orderID], true);
            var shipper = io.getOneShipper(io.orders[orderID].shipperID);
            shipper.order = shipper.order.filter(function(e) {
                var keep = false;
                for (var k = 0; k < store.order.length; ++k) {
                    if (e === store.order[k]) {
                        keep = true;
                        break;
                    }
                }
                return keep;
            });
            result.shipper.push(shipper);
        });

        for (var i = 0; i < io.customers.length; ++i) {
            var customer = {
                order: _.clone(io.customers[i].order, true),
                geoText: io.customers[i].geoText
            };
            customer.order = customer.order.filter(function(e) {
                var keep = false;
                for (var k = 0; k < store.order.length; ++k) {
                    if (e === store.order[k]) {
                        keep = true;
                        break;
                    }
                }
                return keep;
            });
            result.customer.push(customer);
        }

        return result;
    };

    io.getDataForShipper = function(shipperID) {
        var result = {};
        result.shipper = [];
        result.store = [];
        result.customer = [];
        result.orders = {};

        var shipper = io.getOneShipper(shipperID);
        result.shipper.push(shipper);
        shipper.order.forEach(function(orderID) {
            result.orders[orderID] = _.clone(io.orders[orderID], true);
            var store = io.getOneStore(io.orders[orderID].storeID);
            store.order = store.order.filter(function(e) {
                var keep = false;
                for (var k = 0; k < shipper.order.length; ++k) {
                    if (e === shipper.order[k]) {
                        keep = true;
                        break;
                    }
                }
                return keep;
            });
            result.store.push(store);
        });

        for (var i = 0; i < io.customers.length; ++i) {
            var customer = {
                order: _.clone(io.customers[i].order, true),
                geoText: io.customers[i].geoText
            };
            customer.order = customer.order.filter(function(e) {
                var keep = false;
                for (var k = 0; k < shipper.order.length; ++k) {
                    if (e === shipper.order[k]) {
                        keep = true;
                        break;
                    }
                }
                return keep;
            });
            result.customer.push(customer);
        }
        return result;
    };

    io.getDataForAdmin = function() {
        // Returns all data for map of admin
        // Based on io.stores, io.shippers, io.customers, io.orders
        var result = {};
        result.shipper = [];
        result.store = [];
        result.customer = [];
        result.orders = {};

        Object.keys(io.shippers).forEach(function(shipperID) {
            result.shipper.push(io.getOneShipper(shipperID));
        });
        Object.keys(io.stores).forEach(function(storeID) {
            result.store.push(io.getOneStore(storeID));            
        });
        result.customer = _.clone(io.customers, true);
        result.orders = _.clone(io.orders, true);

        console.log('io.getDataForAdmin', io.shippers);
        return result;
    };

    io.containStore = function(storeID) {
        return !!io.stores[storeID];     // bang!! bang!! return true/false :v
    }; 

    io.updateStore = function(store, socket) {
        io.stores[store.storeID].latitude = store.latitude;
        io.stores[store.storeID].longitude = store.longitude;
        io.stores[store.storeID].socketID = socket.id;
    };

    io.updateOrderOfStore = function(storeID, orderID) {
        io.stores[storeID].order.push(orderID);
    };

    io.addStore = function(store, socket) {
        io.stores[store.storeID] = {
            order: [],
            latitude: store.latitude,
            longitude: store.longitude,
            socketID: socket.id
        };            
    };

    io.getOneStore = function(storeID) {
        // remove socketID
        var store = _.clone(io.stores[storeID], true);
        return {
            storeID: storeID,
            order: store.order,
            latitude: store.latitude,
            longitude: store.longitude
        };
    };



    io.containShipper = function(shipperID) {
        return !!io.shippers[shipperID];
    };

    io.countNumTasksByShipperID = function(shipperID){
        var orderIDs = Object.keys(io.orders);
        return  (orderIDs.filter(function(e) {
            return io.orders[e].shipperID === shipperID;
        })).length;
    }

    io.updateNumTasksByShipperID = function(shipperID){
        io.shippers[shipper.shipperID].numTasks = io.countNumTasksByShipperID(shipper.shipperID);
    }

    io.updateShipper = function(shipper, socket) {
        io.shippers[shipper.shipperID].latitude = shipper.latitude;
        io.shippers[shipper.shipperID].longitude = shipper.longitude;
        io.shippers[shipper.shipperID].socketID = socket.id;
        io.shippers[shipper.shipperID].isConnected = true;
        io.shippers[shipper.shipperID].numTasks = io.countNumTasksByShipperID(shipper.shipperID);
    };

    io.updateStatusShipper = function(shipper) {
        io.shippers[shipper.shipperID].isConnected = false;
    };

    io.updateOrderOfShipper = function(shipperID, orderID) {
        io.shippers[shipperID].order.push(orderID);
    };

    io.addShipper = function(shipper, socket) {
        io.shippers[shipper.shipperID] = {
            order: io.getOrderIDsOfShipper(shipper.shipperID),
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            socketID: socket.id,
            isConnected: true,
            numTasks: io.countNumTasksByShipperID(shipper.shipperID)
        };              
    };

    io.getShipperBySocketID = function(socketID) {
        var shipperIDs = Object.keys(io.shippers);
        var shipperID = _.find(shipperIDs, function(e) {
            return io.shippers[e].socketID === socketID;
        });        
        if (!shipperID) return null;
        return io.getOneShipper(shipperID);        
    };

    io.removeShipper = function(shipperID) {
        delete io.shippers[shipperID];
    };

    io.getOneShipper = function(shipperID) {
        var shipper = _.clone(io.shippers[shipperID], true);
        return {
            shipperID: shipperID,
            order: shipper.order,
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            isConnected: shipper.isConnected,
            numTasks: shipper.numTasks
        };
    };

    io.getAllShippers = function() {
        var shipperIDs = Object.keys(io.shippers);
        var shipperInfos = shipperIDs.map(function(shipperID) {
            return {
                shipperID: shipperID,
                latitude: io.shippers[shipperID].latitude,
                longitude: io.shippers[shipperID].longitude,
                isConnected: io.shippers[shipperID].isConnected,
                numTasks: io.shippers[shipperID].numTasks
            };
        });

        return shipperInfos;
    };



    io.addOrder = function(orderID, storeID, shipperID) {
        io.orders[orderID] = {
            shipperID: shipperID,
            storeID: storeID,
            status: 'Picking up',
            isPending: false
        };
    };

    io.getOrdersOfShipper = function(shipperID) {
        var orderIDs = Object.keys(io.orders);
        var filteredOrderIDs = _.clone(orderIDs.filter(function(e) {
            return io.orders[e].shipperID === shipperID;
        }), true);
        return filteredOrderIDs.map(function(e) {
            return {
                orderID: e,
                orderInfo: _.clone(io.orders[e], true)
            };
        });
    };

    io.getOrderIDsOfShipper = function(shipperID) {
        var orderIDs = Object.keys(io.orders);
        return _.clone(orderIDs.filter(function(e) {
            return io.orders[e].shipperID === shipperID;
        }), true);        
    };

    io.updateOrder = function(orderID, newOrder) {
        io.orders[orderID] = _.merge(io.orders[orderID], newOrder);
    };

    io.addCustomer = function(customer) {
        io.customers.push({
            order: _.clone(customer.order),
            geoText: customer.geoText
        });
    };


    io.addToRoom = function(socket, roomID) {
        socket.join(roomID, function() {
            console.log(socket.id, 'join to room', roomID);
            console.log('Room ' + roomID, io.nsps['/'].adapter.rooms[roomID]);            
        });
    };

    var i = 1;
    io.test = function(){
        i++;
        return i;
    };

    io
        .on('connection', socketioJwt.authorize({
            secret: config.secrets.jwt,
            timeout: 15000 // 15 seconds to send the authentication message
        }))
        .on('authenticated', function(socket){
            console.log("--HAVE CONNECTION--");
            var dataToken = socket.decoded_token;
            socket.on("client:register",function(data){

                if(dataToken.userrole == 1){

                    console.log("---This is Data Shipper---");
                    console.log(data);
                    console.log("---This is Data Shipper---");

                    var shipper = data.msg.shipper;
                    if (io.containShipper(shipper.shipperID))
                        io.updateShipper(shipper, socket);
                    else
                        io.addShipper(shipper, socket);

                    io.reply(data.sender, { mapData: io.getDataForShipper(shipper.shipperID) }, 'shipper:register:location');
                    io.forward(data.sender, 'admin', { shipper: io.getOneShipper(shipper.shipperID) }, 'admin:add:shipper');

                    require('./socketShipper')(socket, io);

                }

                if(dataToken.userrole == 2){

                    console.log("---This is Data Store---");
                    console.log(data);
                    console.log("---This is Data Store---");

                    var store = data.msg.store;

                    if (io.containStore(store.storeID))
                        io.updateStore(store, socket);
                    else
                        io.addStore(store, socket);

                    io.reply(data.sender, { mapData: io.getDataForStore(store.storeID) }, 'store:register:location');
                    io.forward(data.sender, 'admin', { store: io.getOneStore(store.storeID) }, 'admin:add:store');

                    require('./socketStore')(socket, io);
                }

                if(dataToken.userrole == 3){

                    console.log("---This is Data Admin---");
                    console.log(data);
                    console.log("---This is Data Admin---");

                    var admin = data.msg.admin;
                    if (io.containAdmin(admin.adminID))
                        io.updateAdmin(admin, socket);
                    else
                        io.addAdmin(admin, socket);

                    io.reply(data.sender, { mapData: io.getDataForAdmin() }, 'admin:register:location');
                    require('./socketAdmin')(socket, io);

                }
            })
        });
    return {
        io: io
    }
}
