/**
 * Created by hoanglvq on 10/26/15.
 */

var _ = require('lodash');

module.exports = function(server,app){

    // IMPORT MODULES

    var socketConnection = {};    

    var io = require('socket.io')(server);
    var socketioJwt = require("socketio-jwt");
    var config      = require('../config/config');
    var controllerStore = require('../manages/storeManage')(app);
    var controllerShipper = require('../manages/shipperManage')(app);

    // HELPER FUNCTION SOCKET

    /*
        Return socket connection by ID
     */
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
    };

    /*
        This function is used to add socket to room
     */
    io.addToRoom = function(socket, roomID) {
        socket.join(roomID, function() {
            console.log(socket.id, 'join to room', roomID);
            console.log('Room ' + roomID+ ":::::: ");// + io.sockets.clients(roomID));
            var clients_in_the_room = io.sockets.adapter.rooms[roomID];
            for (var clientId in clients_in_the_room ) {
                console.log('client: %s', clientId); //Seeing is believing
                //var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
            }
        });
    };

    /*
        This function is used to remove socket from room
     */
    io.leaveRoom = function(socket, roomID) {
        socket.leave(roomID, function() {
            console.log(socket.id, 'leave room', roomID);
            console.log('Room ' + roomID+ ":::::: ");// + io.sockets.clients(roomID));
            var clients_in_the_room = io.sockets.adapter.rooms[roomID];
            for (var clientId in clients_in_the_room ) {
                console.log('client: %s', clientId); //Seeing is believing
                //var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
            }
        });
    };


    // DATA SOCKET

    /*
        io.admins[adminID] = {            
            socketID,
            latitude,
            longitude   
        }
    */
    io.admins = {};

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

    /*
     io.pendingShippers[shipperID] = {
     storeID,
     .....
     }
     */
    io.pendingShippers = {};

    // EVENT LISTEN FOR WATCH DATA
    
    

    // HELPER FUNCTION DATA SOCKET

    io.updateListStore = function(){
        controllerStore.getAllStores().then(function(rs){
            rs = rs.map(function(e){
                return e.toJSON();
            });
            rs.forEach(function(e){
                io.addStore({
                    storeID: e.storeid,
                    latitude: parseFloat(e.latitude),
                    longitude: parseFloat(e.longitude)
                });
            });
        });
    }

    io.updateListShipper = function(){
        controllerShipper.getAllShippers().then(function(rs){
            rs = rs.map(function(e){
                return e.toJSON();
            });
            rs.forEach(function(e){
                io.addShipper({
                    shipperID: e.username,
                    latitude: parseFloat(e.latitude),
                    longitude: parseFloat(e.longitude),
                    isConnected: false
                });
            });
        });
    }


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



    io.containStore = function(storeID) {
        return !!io.stores[storeID];     // bang!! bang!! return true/false :v
    };

    io.updateStore = function(store, socket) {
        io.stores[store.storeID].latitude = store.latitude;
        io.stores[store.storeID].longitude = store.longitude;
        io.stores[store.storeID].socketID = socket.id;
    };

    io.addStore = function(store, socket) {
        io.stores[store.storeID] = {
            order: [],
            latitude: store.latitude,
            longitude: store.longitude,
            socketID: (!!socket ? socket.id : null)
        };
    };



    io.containShipper = function(shipperID) {
        return !!io.shippers[shipperID];
    };

    io.updateShipper = function(shipper, socket) {
        io.shippers[shipper.shipperID].latitude = shipper.latitude;
        io.shippers[shipper.shipperID].longitude = shipper.longitude;
        io.shippers[shipper.shipperID].socketID = socket.id;
        io.shippers[shipper.shipperID].isConnected = true;
        io.shippers[shipper.shipperID].numTasks = io.countNumTasksByShipperID(shipper.shipperID);
    };

    io.addShipper = function(shipper, socket) {
        io.shippers[shipper.shipperID] = {
            order: io.getOrderIDsOfShipper(shipper.shipperID),
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            socketID: (!!socket ? socket.id : null),
            isConnected: (io.shippers.length == 0 ? true : false),
            numTasks: io.countNumTasksByShipperID(shipper.shipperID)
        };
    };



    io.addPendingShipper = function(shipperID, store) {
        io.pendingShippers[shipperID] = store;
    };

    io.removePendingShipper = function(shipperID) {
        delete io.pendingShippers[shipperID];
    };

    io.getNumberPendingShippersOfStore = function(storeID) {
        var count = 0;
        for (shipperID in io.pendingShippers) {
            if (io.pendingShippers[shipperID].storeID == storeID) {
                ++count;
            }
        }
        return count;
    };

    io.removePendingShippersOfStore = function(storeID) {
        for (shipperID in io.pendingShippers) {
            if (io.pendingShippers[shipperID].storeID === storeID) {
                io.removePendingShipper(shipperID);
            }
        }
    };

    io.notifyPendingShippers = function(storeID, avoidedShipperID, sender, msg) {
        for (shipperID in io.pendingShippers) {
            if (shipperID !== avoidedShipperID && io.pendingShippers[shipperID].storeID == storeID) {
                io.forward(
                    sender,
                    {
                        type: 'shipper',
                        clientID: shipperID
                    },
                    msg,
                    'shipper:remove:express');
            }
        }
    };


    // MAP DATA

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
        console.log('getDataForStore', result);
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



    // STORE FUNCTIONS
	io.reconnectStore = function(storeid, socket){
      for(keys in io.orders){
          if (io.orders[keys].storeID === storeid) {
              io.addToRoom(socket, io.orders[keys].shipperID);
          }
      }
    };

    io.updateOrderOfStore = function(storeID, orderID) {
        io.stores[storeID].order.push(orderID);
    };

    io.removeOrderOfStore = function(storeID, orderID) {
        for(var i =  0; i < io.stores[storeID].order.length; i++){
            if (io.stores[storeID].order[i] === orderID) {
                io.stores[storeID].order.splice(i, 1);
                break;
            }
        }
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

    io.addOrder = function(orderID, storeID, shipperID) {
        io.orders[orderID] = {
            shipperID: shipperID,
            storeID: storeID,
            status: 'Picking up',
            isPending: false
        };
    };

    io.removeOrder = function(orderID) {
        delete io.orders[orderID];
    };

    io.updateOrder = function(orderID, newOrder) {
        io.orders[orderID] = _.merge(io.orders[orderID], newOrder);
    };



    // SHIPPER FUNCTION

    io.countNumTasksByShipperID = function(shipperID){
        var orderIDs = Object.keys(io.orders);
        return  (orderIDs.filter(function(e) {
            return io.orders[e].shipperID === shipperID;
        })).length;
    }

    io.updateNumTasksByShipperID = function(shipperID){
        io.shippers[shipperID].numTasks = io.countNumTasksByShipperID(shipperID);
    }

    io.updateStatusShipper = function(shipper) {
        io.shippers[shipper.shipperID].isConnected = false;
    };

    io.updateOrderOfShipper = function(shipperID, orderID) {
        io.shippers[shipperID].order.push(orderID);
    };

    io.removeOrderOfShipper = function(shipperID, orderID) {
        for(var i =  0; i < io.shippers[shipperID].order.length; i++){
            if (io.shippers[shipperID].order[i] === orderID) {
                io.shippers[shipperID].order.splice(i, 1);
                break;
            }
        }
    };

    io.getShipperBySocketID = function(socketID) {
        var shipperIDs = Object.keys(io.shippers);
        var shipperID = _.find(shipperIDs, function(e) {
            return io.shippers[e].socketID === socketID;
        });        
        if (!shipperID) return null;
        return io.getOneShipper(shipperID);        
    };

    io.disconnectShipper = function(shipperID) {
        io.shippers[shipperID].isConnected = false;
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
    /*
         HuyTDH - 18-11-2015
         START - Find id of socket connection by shipper id
     */
    io.findSocketIdByShipperId = function(shipperid){
        var socket =  io.shippers[shipperid];
        if(socket) return socket.socketID;
        return null;
    };



    // CUSTOMER FUNCTION

    io.addCustomer = function(customer) {
        io.customers.push({
            order: _.clone(customer.order),
            geoText: customer.geoText
        });
    };

    io.removeCustomer = function(customer) {
        var searchCustomer = {
            order: _.clone(customer.order),
            geoText: customer.geoText
        };
        for(var i =  0; i < io.customers.length; i++){
            if (io.customers[i] === searchCustomer) {
                io.customers.splice(i, 1);
                break;
            }
        }
    };



    // OTHER FUNCTION

    io.updateListStore = function(){
        controllerStore.getAllStores()
            .then(function(rs){
                rs = rs.map(function(e) {
                    return e.toJSON();
                })
                rs.forEach(function(item){
                    io.addStore({
                        storeID: item.storeid,
                        latitude: item.latitude,
                        longitude: item.longitude
                    })
                })
            })
    }

    //io.updateListStore();

    io.leaveRoom = function(socket, roomID) {
        socket.leave(roomID, function() {
            console.log(socket.id, 'leave room', roomID);
            console.log('Room ' + roomID+ ":::::: ");// + io.sockets.clients(roomID));
            var clients_in_the_room = io.sockets.adapter.rooms[roomID];
            for (var clientId in clients_in_the_room ) {
                console.log('client: %s', clientId); //Seeing is believing
                //var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
            } 
        });
    };

    //// HuyTDH - 25-11-2015
    // START - Change shipper of an order active
    io.changeShipperOfOrder = function(shipperID, orderID){
        for(var i = 0; i != io.orders.length; i++){
            if(io.orders[i].orderID === orderID){
                io.orders[i].shipperID = shipperID;
                return true;
            }
        }
        return false;
    };
    // END - Change shipper of an order active

    //// HuyTDH - 25-11-2015
    // START - Change all order of shipper to pending or not
    io.updatePendingOrder = function(shipperid, status){
        var orders = io.getOrdersOfShipper(shipperid);
        orders.forEach(function(e) {
            e.orderInfo.isPending = status;
            io.updateOrder(e.orderID, e.orderInfo);
        });
    };
    // END - Change all order of shipper to pending or not

    //// HuyTDH - 18-11-2015
    // START - Find id of socket connection by shipper id
    io.findSocketIdByShipperId = function(shipperid){
        var socket =  io.shippers[shipperid];
        if(socket) return socket.socketID;
        return null;
    };
    // END - Find id of socket connection by shipper id

    /*
		HuyTDH - 18-11-2015
        START - Update information of socket when shipper start a task
	*/
    io.startTask = function(orderID, storeid, shipperid, customer){
        io.addOrder(orderID, storeid, shipperid);
        io.updateOrderOfShipper(shipperid, orderID);
        io.updateOrderOfStore(storeid, orderID);
        io.addCustomer(customer);
        var roomID = shipperid;
        var store = {
            clientID: storeid,
            type: 'store'
        };
        var socketStore = io.receiverSocket(store);
        if(socketStore){
            io.addToRoom(socketStore,roomID);
        }
    };

    /*
        HuyTDH - 18-11-2015
        START - Update information of socket when shipper finished a task
     */
    io.finishTask = function(orderID, storeid, shipperid, customer){
        io.removeOrder(orderID);
        io.removeOrderOfShipper(shipperid, orderID);
        io.removeOrderOfStore(storeid, orderID);
        io.removeCustomer(customer);
        var roomID = shipperid;
        var store = {
            clientID: storeid,
            type: 'store'
        };
        var socketStore = io.receiverSocket(store);
        if(socketStore){
            io.leaveRoom(socketStore,roomID);
        }
    };




    // RUN

    io.updateListStore();
    io.updateListShipper();


    io
        .on('connect', socketioJwt.authorize({
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
                    if (io.containShipper(shipper.shipperID)) {
                        io.updateShipper(shipper, socket);
                        var orders = io.getOrdersOfShipper(shipper.shipperID);
                        orders.forEach(function(e) {
                            e.orderInfo.isPending = false;
                            io.updateOrder(e.orderID, e.orderInfo);
                        });
                        console.log('after connect', orders);
                        io.forward(
                        {
                            type: 'shipper',
                            clientID: shipper.shipperID
                        },
                        [ { room: shipper.shipperID }, 'admin' ],
                        {
                            orders: orders
                        },
                        [ 'store:update:order', 'admin:update:order' ]);        
                    } else
                        io.addShipper(shipper, socket);

                    io.reply(data.sender, { mapData: io.getDataForShipper(shipper.shipperID) }, 'shipper:register:location');
                    io.forward(data.sender, ['admin', { room: shipper.shipperID }], {
                        shipper: io.getOneShipper(shipper.shipperID),
                        shipperList: io.getAllShippers()
                    }, ['admin:add:shipper', 'store:add:shipper']);

                    require('./socketShipper')(socket, io, app);
                }

                if(dataToken.userrole == 2){

                    console.log("---This is Data Store---");
                    console.log(data);
                    console.log("---This is Data Store---");

                    var store = data.msg.store;

                    if (io.containStore(store.storeID)) {
                        io.updateStore(store, socket);
                    } else
                        io.addStore(store, socket);

                    console.log("---DATA STORE---");
                    console.log(io.getOneStore(store.storeID));
                    console.log("---DATA STORE---");

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

                    io.reply(data.sender, {
                        mapData: io.getDataForAdmin(),
                        shipperList: io.getAllShippers()
                    }, 'admin:register:location');

                    require('./socketAdmin')(socket, io, app);

                }
            })
        });

    return {
        io: io
    }
}
