/**
 * Created by hoanglvq on 10/26/15.
 */



module.exports = function(server){
    
    var socketConnection = {};    

    var io = require('socket.io')(server);

    io.listStore = {};    
    io.listShipper = {};

    io.on('connection',function(socket){

        console.log("have connection in Server");

        socket.on("store:register:location",function(data){                    
            console.log(data);            
            io.listStore[socket.id] = data;
            socket.emit("store:register:location",true);                        
            require('./socketStore')(socket, io);
        })

        socket.on("admin:register:location",function(data){
            console.log(data);

            socket.emit("admin:register:location",true);
            require('./socketAdmin')(socket, io);                
        })

        socket.on("shipper:register:location",function(data){
            console.log(data);                        
            io.listShipper[socket.id] = data;
            socket.emit("shipper:register:location",true);            
            require('./socketShipper')(socket, io);
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
