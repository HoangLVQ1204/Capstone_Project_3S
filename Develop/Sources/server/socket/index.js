/**
 * Created by hoanglvq on 10/26/15.
 */



module.exports = function(server){

    var listShipper = {};
    var socketConnection = {};    

    var io = require('socket.io')(server);


    var distanceFrom = function(currentPosition,listShipper,distanceRadius){

    }

    var findShipper = function(socket, data){
        var listShipperNearest = {};        
    }


    io.on('connection',function(socket){

        console.log("have connection in Server");

        socket.on("store:register:location",function(data){
            socket.join('store', function() {
                console.log('one joined room Store');
            })
            console.log('Store', Object.keys(io.to('store').connected));

            console.log(data);
            if(data)
                socket.emit("store:register:location",true);
            else
                socket.emit("store:register:location",false);

            socket.on('disconnect', function() {
                console.log('Store', socket.id, 'disconnect');
            })
        })

        socket.on("admin:register:location",function(data){
            socket.join('admin', function() {
                console.log('one joined room Admin');
            })
            console.log('Admin', Object.keys(io.to('admin').connected));

            console.log(data);
            if(data)
                socket.emit("admin:register:location",true);
            else
                socket.emit("admin:register:location",false);

            socket.on('disconnect', function() {
                console.log('Admin', socket.id, 'disconnect');
            })
        })

        socket.on("shipper:register:location",function(data){
            socket.join('shipper', function() {
                console.log('one joined room Shipper');
            })
            console.log('Admin', Object.keys(io.to('admin').connected));

            console.log(data);
            io.to('admin').emit('shipper:hello', socket.id);
            if(data)
                socket.emit("shipper:register:location",true);
            else
                socket.emit("shipper:register:location",false);      

            socket.on('disconnect', function() {
                console.log('Shipper', socket.id, 'disconnect');
            })      
        })


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
