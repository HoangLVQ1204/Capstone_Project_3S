/**
 * Created by hoanglvq on 10/26/15.
 */



module.exports = function(server){
    
    var socketConnection = {};    

    var io = require('socket.io')(server);

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
            return io.to(room);
        }
        if (receiver.clientID) {    // clientID is shipperID || storeID
            return io.sockets.connected[receiver.clientID];
        }        
    };

    /*
        receiver = {clientID: ...}
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
        sender: clientID
        receiver = 'admin' || 'shipper' || 'store' || {room: ...} || {clientID: ...} || Arrays of these types
        msg = Object
    */
    io.forward = function(sender, receiver, msg, eventName, callback) {
        var data = {
            sender: sender,
            receiver: receiver,
            msg: msg
        };        
        [].concat(receiver).forEach(function(type) {
            io.receiverSocket(type).emit(eventName, data, callback);
        });        
    }

    // var distanceFrom = function(currentPosition,listShipper,distanceRadius){

    // };

    // var findShipper = function(socket, data){
    //     var listShipperNearest = {};        
    // };

    io.getDataForStore = function(storeID) {
        // Returns data for map of storeID
        // Based on io.stores, io.shippers, io.customers, io.orders
    };

    io.getDataForShipper = function(shipperID) {
        // Returns data for map of shipperID
        // Based on io.stores, io.shippers, io.customers, io.orders
    };

    io.getDataForAdmin = function() {
        // Returns all data for map of admin
        // Based on io.stores, io.shippers, io.customers, io.orders
    };

    io.containStore = function(storeID) {
        return !!io.listStore[storeID];     // bang!! bang!! return true/false :v
    }; 

    io.updateStore = function(store, socket) {
        io.listStore[store.storeID].latitude = store.latitude;
        io.listStore[store.storeID].longitude = store.longitude;
        io.listStore[store.storeID].socketID = socket.id;
    };

    io.addStore = function(store, socket) {        
        io.listStore[store.storeID] = {
            order: [],
            latitude: store.latitude,
            longitude: store.longitude,
            socketID: socket.id
        };            
    };

    io.getOneStore = function(storeID) {
        // remove socketID
        var store = io.listStore[storeID];
        return {
            storeID: storeID,
            order: store.order,
            latitude: store.latitude,
            longitude: store.longitude
        };
    };

    io.containShipper = function(shipperID) {
        return !!io.listShipper[shipperID];
    };

    io.updateShipper = function(shipper, socket) {
        io.listShipper[shipper.shipperID].latitude = shipper.latitude;
        io.listShipper[shipper.shipperID].longitude = shipper.longitude;
        io.listShipper[shipper.shipperID].socketID = socket.id;
    };

    io.addShipper = function(shipper, socket) {
        io.listShipper[shipper.shipperID] = {
            order: [],
            latitude: shipper.latitude,
            longitude: shipper.longitude,
            socketID: socket.id,
            status: shipper.status
        };              
    };

    io.getOneShipper = function(shipperID) {
        // remove socketID
        var shipper = io.listShipper[shipperID];
        return {
            shipperID: shipperID,
            order: shipper.order,
            latitude: shipper.latitude,
            longitude: shipper.longitude
        };
    }


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
