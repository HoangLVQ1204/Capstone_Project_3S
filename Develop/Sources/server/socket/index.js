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
    io.gmapUtil = require('./googlemapUtil');

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


    var icons = {
        shipperIcon: 'http://maps.google.com/mapfiles/kml/shapes/motorcycling.png',           
        storeIcon: 'http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
        customerIcon: 'http://maps.google.com/mapfiles/kml/shapes/man.png',
        issueIcon: 'http://maps.google.com/mapfiles/kml/shapes/caution.png',
        issueIcon2: 'http://maps.google.com/mapfiles/kml/pal3/icon33.png',
        disconnectIcon: 'http://maps.google.com/mapfiles/kml/pal3/icon33.png',
        pink48: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Bubble-Pink-icon.png',
        pink32: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Bubble-Pink-icon.png',
        blue48: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Bubble-Azure-icon.png',
        blue32: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Bubble-Azure-icon.png',
        green48: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Bubble-Chartreuse-icon.png',
        green32: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Bubble-Chartreuse-icon.png'
    };


    /*
        These functions are used to init shipper, store, customer
     */
    io.initShipper = function(shipperMarker) {  
        if (!shipperMarker.order)  
            shipperMarker.order = [];
        shipperMarker.icon = icons.shipperIcon;
        shipperMarker.avatar = "assets/avatar/shipper/SP000002.jpg";
    };

    io.initStore = function(storeMarker) {    
        if (!storeMarker.order)
            storeMarker.order = [];
        storeMarker.icon = icons.storeIcon;
    };

    // add customerID into orders
    io.initCustomer = function(customerMarker) {    
        customerMarker.customerID = customerMarker.order[0];
        customerMarker.order.forEach(function(order) {        
            io.orders[order].customerID = customerMarker.customerID;
        });

        customerMarker.icon = icons.customerIcon;

        return io.gmapUtil.getLatLng(customerMarker.geoText)
        .then(function(coords) {
            customerMarker.latitude = coords.latitude;
            customerMarker.longitude = coords.longitude;
        })
        .catch(function(err) {
            console.log('initCustomer', err);
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
     longitude,
     icon,
     geoText
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
     numTasks,
     icon,
     geoText,
     haveIssue
     }
     */
    io.shippers = {};

    /*
     io.customers[i] = {
     order: [],
     geoText,
     latitude,
     longitude,
     icon,
     customerID
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
     },
     customerID
     */
    io.orders = {};

    /*
     io.pendingShippers[shipperID] = {
     storeID,
     .....
     }
     */
    io.pendingShippers = {};
    
    // Define observer for watching io.shippers, io.stores, io.customers, io.orders
    var observer = function(changes) {
        // console.log('observer', io.orders);
        // console.log('total shippers in observer', io.shippers);
        for (shipperID in io.shippers) {      
            // console.log('observer shipper', shipperID);      
            if (io.shippers[shipperID].isConnected) {
                // console.log('observer shipper', shipperID);
                io.reply({ type: 'shipper', clientID: shipperID }, 
                    { mapData: io.getDataForShipper(shipperID) }, 'shipper:register:location');
            }
        }
        // console.log('total stores in observer', io.stores);
        for (storeID in io.stores) {
            if (io.stores[storeID].socketID) {
                // console.log('observer store', storeID);
                io.reply({ type: 'store', clientID: storeID }, 
                    { mapData: io.getDataForStore(storeID) }, 'store:register:location');
            }
        }
        // console.log('total admins in observer', io.admins);
        for (adminID in io.admins) {
            if (io.admins[adminID].socketID) {
                // console.log('observer admin', adminID);
                io.reply({ type: 'admin', clientID: adminID }, 
                    { mapData: io.getDataForAdmin(),
                      shipperList: io.getAllShippers() }, 'admin:register:location');   
            }
        }        
    };

    Object.observe(io.admins, observer);
    Object.observe(io.shippers, observer);
    Object.observe(io.stores, observer);
    Object.observe(io.customers, observer);
    Object.observe(io.orders, observer);
    


    // HELPER FUNCTION DATA SOCKET

    io.updateListStore = function(){
        return controllerStore.getAllStores().then(function(rs){
            rs = rs.map(function(e){
                return e.toJSON();
            });
            // console.log('updateListStore', rs);
            rs.forEach(function(e){
                io.addStore({
                    storeID: e.storeid,
                    latitude: parseFloat(e.latitude),
                    longitude: parseFloat(e.longitude),
                    geoText: e.address
                });
            });
        });
    }

    io.updateListShipper = function(){
        return controllerShipper.getAllShippers().then(function(rs){
            rs = rs.map(function(e){
                return e.toJSON();
            });
            // console.log('updateListShipper', rs);
            var rsPromises = rs.map(function(e){
                return io.addShipper({
                    shipperID: e.username,
                    isConnected: false
                });
            });
            return Promise.all(rsPromises);
        });
    }


    io.containAdmin = function(adminID) {
        return !!io.admins[adminID];
    };

    io.updateAdmin = function(admin, socket) {
        var temp = _.clone(io.admins[admin.adminID], true);
        temp.socketID = socket.id;
        io.admins[admin.adminID] = temp;
    };

    io.addAdmin = function(admin, socket) {
        io.admins[admin.adminID] = {            
            socketID: socket.id            
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
            if (shipper.icon == icons.disconnectIcon) {
                shipper.icon = icons.issueIcon;
            }
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
                customerID: io.customers[i].customerID,
                order: _.clone(io.customers[i].order, true),
                geoText: io.customers[i].geoText,
                latitude: io.customers[i].latitude,
                longitude: io.customers[i].longitude,
                icon: io.customers[i].icon
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
            if (customer.order.length > 0)
                result.customer.push(customer);
        }
        // console.log('getDataForStore', result);
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
                customerID: io.customers[i].customerID,
                order: _.clone(io.customers[i].order, true),
                geoText: io.customers[i].geoText,
                latitude: io.customers[i].latitude,
                longitude: io.customers[i].longitude,
                icon: io.customers[i].icon
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
            if (customer.order.length > 0)
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
            var shipper = io.getOneShipper(shipperID);
            result.shipper.push(shipper);
        });
        Object.keys(io.stores).forEach(function(storeID) {
            result.store.push(io.getOneStore(storeID));            
        });
        result.customer = _.clone(io.customers, true);
        result.orders = _.clone(io.orders, true);
        
        // console.log('getDataForAdmin', result);
        return result;
    };




    // STORE FUNCTIONS
    io.containStore = function(storeID) {
        return !!io.stores[storeID];     // bang!! bang!! return true/false :v
    };

    io.updateStore = function(store, socket) {
        var temp = _.clone(io.stores[store.storeID], true);
        temp.latitude = store.latitude;
        temp.longitude = store.longitude;
        temp.socketID = socket.id;
        io.stores[store.storeID] = temp;
    };

    io.addStore = function(store, socket) {
        var newStore = {
            order: [],
            latitude: store.latitude,
            longitude: store.longitude,
            geoText: store.geoText,
            socketID: (!!socket ? socket.id : null)
        };        
        io.initStore(newStore);
        // console.log('add store', store.storeID, newStore);
        io.stores[store.storeID] = newStore;
    };

	io.reconnectStore = function(storeid, socket){
      for(keys in io.orders){
          if (io.orders[keys].storeID === storeid) {
              io.addToRoom(socket, io.orders[keys].shipperID);
          }
      }
    };

    io.storeContainOrderID = function(store, orderID) {
        var find = _.find(store.order, function(e) {
            return e == orderID;
        });
        return !!find;
    };

    io.updateOrderOfStore = function(storeID, orderID) {
        var temp = _.clone(io.stores[storeID], true);
        if (!io.storeContainOrderID(temp, orderID))
            temp.order.push(orderID);
        io.stores[storeID] = temp;
    };

    io.removeOrderOfStore = function(storeID, orderID) {
        var temp = _.clone(io.stores[storeID], true);
        for(var i = temp.order.length - 1; i >= 0 ; i--){
            if (temp.order[i] === orderID) {
                temp.order.splice(i, 1);
                break;
            }
        }
        io.stores[storeID] = temp;
    };

    io.getOneStore = function(storeID) {
        // remove socketID
        var store = _.clone(io.stores[storeID], true);
        return {            
            storeID: storeID,
            order: store.order,
            latitude: store.latitude,
            longitude: store.longitude,
            geoText: store.geoText,
            icon: store.icon
        };
    };


    // ORDER FUNCTIONS
    io.addOrder = function(orderID, store, shipper, customer) {
        io.orders[orderID] = {
            shipperID: shipper.shipperID,
            storeID: store.storeID,
            status: 'Picking up',
            isPending: false
        };

        return io.addCustomer(customer)
        .then(function() {
            io.updateOrderOfShipper(shipper.shipperID, orderID);
            io.updateOrderOfStore(store.storeID, orderID);            
        });
    };

    io.removeOrder = function(orderID) {
        delete io.orders[orderID];
    };

    io.updateOrder = function(orderID, newOrder) {
        io.orders[orderID] = _.merge(io.orders[orderID], newOrder);
    };

    io.updateStatusOrder = function(orderID, status) {
        if (io.orders[orderID]) {
            var temp = _.clone(io.orders[orderID], true);        
            temp.status = status;
            io.orders[orderID] = temp;
        }                
    };




    // SHIPPER FUNCTION
    io.containShipper = function(shipperID) {
        return !!io.shippers[shipperID];
    };

    io.updateShipper = function(shipper, socket) {
        var temp = _.clone(io.shippers[shipper.shipperID], true);
        // console.log('updateShipper', temp);
        temp.latitude = shipper.latitude;
        temp.longitude = shipper.longitude;
        temp.socketID = socket.id;
        temp.isConnected = true;
        temp.numTasks = io.countNumTasksByShipperID(shipper.shipperID);
        // if (temp.haveIssue)
        //     temp.icon = icons.issueIcon;
        // else {
        //     if (!temp.isConnected)
        //         temp.icon = icons.disconnectIcon;
        //     else 
        //         temp.icon = icons.shipperIcon;
        // }
            
        return io.gmapUtil.getGeoText(temp.latitude, temp.longitude)
        .then(function(geoText) {
            // console.log('geoText', geoText);
            temp.geoText = geoText;
            io.shippers[shipper.shipperID] = temp;
        });
    };

    io.addShipper = function(shipper, socket) {
        var newShipper = {
            order: io.getOrderIDsOfShipper(shipper.shipperID),
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            socketID: (!!socket ? socket.id : null),
            isConnected: (!!socket ? true : false),
            numTasks: io.countNumTasksByShipperID(shipper.shipperID),
            haveIssue: false
        };
        io.initShipper(newShipper);       
        if (newShipper.latitude && newShipper.longitude) {
            return io.gmapUtil.getGeoText(newShipper.latitude, newShipper.longitude)
            .then(function(geoText) {
                // console.log('geoText', geoText);
                newShipper.geoText = geoText;
                io.shippers[shipper.shipperID] = newShipper;
            });
        } else {
            io.shippers[shipper.shipperID] = newShipper;
            return Promise.resolve();
        }  
    };

    io.countNumTasksByShipperID = function(shipperID){
        var orderIDs = Object.keys(io.orders);
        return  (orderIDs.filter(function(e) {
            return io.orders[e].shipperID === shipperID;
        })).length;
    }

    io.updateNumTasksByShipperID = function(shipperID){
        var temp = _.clone(io.shippers[shipperID], true);
        temp.numTasks = io.countNumTasksByShipperID(shipperID);
        io.shippers[shipperID] = temp;
    }

    io.updateStatusShipper = function(shipper) {
        var temp = _.clone(io.shippers[shipper.shipperID], true);
        temp.isConnected = false;
        temp.icon = icons.disconnectIcon;
        io.shippers[shipper.shipperID] = temp;
    };

    io.updateIssueForShipper = function(shipperID, haveIssue) {
        console.log('updateIssueForShipper', shipperID, haveIssue);
        var temp = _.clone(io.shippers[shipperID], true);
        temp.haveIssue = haveIssue;
        if (haveIssue)
            temp.icon = icons.issueIcon;
        else 
            temp.icon = icons.shipperIcon;
        io.shippers[shipperID] = temp;  
    };

    io.updateLocationShipper = function(shipper) {
        var temp = _.clone(io.shippers[shipper.shipperID], true);
        temp.latitude = shipper.latitude;
        temp.longitude = shipper.longitude;
        return io.gmapUtil.getGeoText(temp.latitude, temp.longitude)
        .then(function(geoText) {
            temp.geoText = geoText;
            io.shippers[shipper.shipperID] = temp;
        });        
    };

    io.shipperContainOrderID = function(shipper, orderID) {
        var find = _.find(shipper.order, function(e) {
            return e == orderID;
        });
        return !!find;
    };

    io.updateOrderOfShipper = function(shipperID, orderID) {
        var temp = _.clone(io.shippers[shipperID], true);
        if (!io.shipperContainOrderID(temp, orderID))
            temp.order.push(orderID);
        io.shippers[shipperID] = temp;
    };

    io.removeOrderOfShipper = function(shipperID, orderID) {
        var temp = _.clone(io.shippers[shipperID], true);
        for(var i =  0; i < temp.order.length; i++){
            if (temp.order[i] === orderID) {
                temp.order.splice(i, 1);
                break;
            }
        }
        io.shippers[shipperID] = temp;
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
        console.log('disconnectShipper');
        var temp = _.clone(io.shippers[shipperID], true);
        temp.isConnected = false;
        if (temp.order.length > 0)
            temp.icon = icons.disconnectIcon;
        else
            temp.icon = icons.shipperIcon;
        io.shippers[shipperID] = temp;
    };

    io.getOneShipper = function(shipperID) {
        var shipper = _.clone(io.shippers[shipperID], true);
        return {
            shipperID: shipperID,
            order: shipper.order,
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            isConnected: shipper.isConnected,
            numTasks: shipper.numTasks,
            icon: shipper.icon,
            geoText: shipper.geoText,
            haveIssue: shipper.haveIssue
        };
    };

    io.getAllShippers = function() {
        var shipperIDs = Object.keys(io.shippers);
        var shipperInfos = shipperIDs.map(function(shipperID) {
            // return {
            //     shipperID: shipperID,
            //     latitude: io.shippers[shipperID].latitude,
            //     longitude: io.shippers[shipperID].longitude,
            //     isConnected: io.shippers[shipperID].isConnected,
            //     numTasks: io.shippers[shipperID].numTasks
            // };
            return io.getOneShipper(shipperID);
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
        var newCustomer = {
            order: _.clone(customer.order),
            geoText: customer.geoText
        };        
        return io.initCustomer(newCustomer)
        .then(function() {                        
            console.log('addCustomer', newCustomer);
            io.customers.push(newCustomer);
        });
    };

    io.removeCustomer = function(customer) {
        var searchCustomer = {
            order: _.clone(customer.order),
            geoText: customer.geoText
        };
        for(var i =  0; i < io.customers.length; i++){
            if (_.isEqual(io.customers[i], searchCustomer)) {
                io.customers.splice(i, 1);
                break;
            }
        }
    };




    // ORDER FUNCTION

    /*
        by HuyTDH - 25-11-2015
        START - Change shipper of an order active
     */
    io.changeShipperOfOrder = function(shipperID, orderID){
        for( i in io.orders){
            if(i === orderID){
                io.orders[i].shipperID = shipperID;
                return true;
            }
        }
        return false;
    };

    /*
        HuyTDH - 25-11-2015
        START - Change all order of shipper to pending or not
     */
    io.updatePendingOrder = function(shipperid, status){
        var orders = io.getOrdersOfShipper(shipperid);
        orders.forEach(function(e) {
            e.orderInfo.isPending = status;
            io.updateOrder(e.orderID, e.orderInfo);
        });
    };




    // OTHER FUNCTION

    /*
		HuyTDH - 18-11-2015
        START - Update information of socket when shipper start a task
	*/    
    io.startTask = function(orderID, storeid, shipperid, customer){
        io.addOrder(orderID, { storeID: storeid }, { shipperID: shipperid }, customer)
        .then(function() {
            var roomID = shipperid;
            var store = {
                clientID: storeid,
                type: 'store'
            };
            var socketStore = io.receiverSocket(store);
            if(socketStore){
                io.addToRoom(socketStore,roomID);
            }
        });        
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

    io.updateListStore()
    .then(function() {
        return io.updateListShipper();
    })
    .then(function() {
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
                            io.updateShipper(shipper, socket)
                            .then(function() {
                                var orders = io.getOrdersOfShipper(shipper.shipperID);
                                orders.forEach(function(e) {
                                    e.orderInfo.isPending = false;
                                    io.updateOrder(e.orderID, e.orderInfo);
                                });
                                // console.log('after connect', orders);
                                require('./socketShipper')(socket, io, app);
                            });
                        } else {
                            io.addShipper(shipper, socket)
                            .then(function() {
                                require('./socketShipper')(socket, io, app);
                            });
                        }
                    }

                    if(dataToken.userrole == 2){

                        console.log("---This is Data Store---");
                        console.log(data);
                        console.log("---This is Data Store---");

                        var store = data.msg.store;

                        if (io.containStore(store.storeID)) {
                            io.updateStore(store, socket);
                            io.reconnectStore(store.storeID, socket);
                        } else
                            io.addStore(store, socket);

                        console.log("---DATA STORE---");
                        console.log(io.getOneStore(store.storeID));
                        console.log("---DATA STORE---");

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

                        require('./socketAdmin')(socket, io, app);
                    }
                })
            });
    });    

    return {
        io: io
    }
}
