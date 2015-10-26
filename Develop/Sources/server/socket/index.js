/**
 * Created by hoanglvq on 10/26/15.
 */



module.exports = function(server){

    var listShipper = {};
    var socketConnection = {};

    var io = require('socket.io')(server);


    var store   = io.of('/store');
    var admin   = io.of('/admin');
    var shipper = io.of('/shipper');

    var distanceFrom = function(currentPosition,listShipper,distanceRadius){


    }

    var findShipper = function(socket, data){
        var listShipperNearest = {};

    }

    store.on('connection',function(socket){
        console.log("have connection in Store");
        socket.on("store:register:location",function(data){
            console.log(data);
            if(data)
                socket.emit("store:register:location",true);
            else
                socket.emit("store:register:location",false);
        })


    })

    admin.on('connection',function(socket){
        console.log("have connection in Admin");
        socket.on("admin:register:location",function(data){
            console.log(data);
            if(data)
                socket.emit("admin:register:location",true);
            else
                socket.emit("admin:register:location",false);
        })
    })



    shipper.on('connection',function(socket){
        console.log("have connection in Shipper");
        socket.on("shipper:register:location",function(data){
            console.log(data);
            if(data)
                socket.emit("shipper:register:location",true);
            else
                socket.emit("shipper:register:location",false);
        })
    })
}