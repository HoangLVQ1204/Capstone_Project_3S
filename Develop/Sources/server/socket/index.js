/**
 * Created by hoanglvq on 10/26/15.
 */


var _ = require('lodash');

module.exports = function(server){
    
    var socketConnection = {};    

    var io = require('socket.io')(server);

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
            status   
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
            storeID            
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
                socketID = io.shippers[receiver.clientID].socketID;
            } else if (receiver.type == 'store') {
                socketID = io.stores[receiver.clientID].socketID;
            } else if (receiver.type == 'admin') {
                socketID = io.admins[receiver.clientID].socketID;
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
        receiver = 'admin' || 'shipper' || 'store' || {room: ...} || { type: xxx, clientID: xxx } || Arrays of these types [ 'admin', { room: ...} ]
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
            io.receiverSocket(type).emit(listEvents[index], data, callback);            
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
        // Returns data for map of shipperID
        // Based on io.stores, io.shippers, io.customers, io.orders

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

    io.updateShipper = function(shipper, socket) {
        io.shippers[shipper.shipperID].latitude = shipper.latitude;
        io.shippers[shipper.shipperID].longitude = shipper.longitude;
        io.shippers[shipper.shipperID].socketID = socket.id;
    };

    io.updateOrderOfShipper = function(shipperID, orderID) {
        io.shippers[shipperID].order.push(orderID);
    };

    io.addShipper = function(shipper, socket) {
        io.shippers[shipper.shipperID] = {
            order: [],
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            socketID: socket.id,
            status: shipper.status
        };              
    };

    io.getOneShipper = function(shipperID) {
        // remove socketID
        var shipper = _.clone(io.shippers[shipperID], true);
        return {
            shipperID: shipperID,
            order: shipper.order,
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            status: shipper.status
        };
    };

    io.getAllShippers = function() {
        var shipperIDs = Object.keys(io.shippers);
        var shipperInfos = shipperIDs.map(function(shipperID) {
            return {
                shipperID: shipperID,
                latitude: io.shippers[shipperID].latitude,
                longitude: io.shippers[shipperID].longitude,
                status: io.shippers[shipperID].status
            };
        });
        return shipperInfos;
    };



    io.addOrder = function(orderID, storeID, shipperID) {
        io.orders[orderID] = {
            shipperID: shipperID,
            storeID: storeID
        };
    };    

    io.addCustomer = function(customer) {
        io.customers.push({
            order: customer.order,
            geoText: customer.geoText
        });
    };


    io.addToRoom = function(socket, roomID) {
        socket.join(roomID, function() {
            console.log(socket.id, 'join to room', roomID);
            console.log('Room ' + roomID, io.nsps['/'].adapter.rooms[roomID]);            
        });
    };


    io.on('connection',function(socket){

        console.log("have connection in Server");

        socket.on("store:register:location",function(data){                    
            console.log(data);
            
            var store = data.msg.store; 
            if (io.containStore(store.storeID))
                io.updateStore(store, socket);
            else           
                io.addStore(store, socket);
                        
            io.reply(data.sender, { mapData: io.getDataForStore(store.storeID) }, 'store:register:location');
            io.forward(data.sender, 'admin', { store: io.getOneStore(store.storeID) }, 'admin:add:store');
            
            require('./socketStore')(socket, io);
        });

        socket.on("admin:register:location",function(data){
            console.log(data);              

            var admin = data.msg.admin;      
            if (io.containAdmin(admin.adminID))
                io.updateAdmin(admin, socket);
            else           
                io.addAdmin(admin, socket);

            io.reply(data.sender, { mapData: io.getDataForAdmin() }, 'admin:register:location');                        
            require('./socketAdmin')(socket, io);
        });

        socket.on("shipper:register:location",function(data){
            console.log(data);
            
            var shipper = data.msg.shipper;              
            if (io.containShipper(shipper.shipperID))
                io.updateShipper(shipper, socket);
            else 
                io.addShipper(shipper, socket);
                        
            io.reply(data.sender, { mapData: io.getDataForShipper(shipper.shipperID) }, 'shipper:register:location');
            io.forward(data.sender, 'admin', { shipper: io.getOneShipper(shipper.shipperID) }, 'admin:add:shipper');
            
            require('./socketShipper')(socket, io);
        });


    })

}



/*

hoang: admin
khanhkute: store
nhungkaka: store
huykool: shipper
quyensheep: shipper

*/


/* Oh, my dear


// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');


*/
