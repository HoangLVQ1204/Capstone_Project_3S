/**
 * Created by hoanglvq on 10/26/15.
 */



module.exports = function(server){
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
        console.log("have connection in Store :" + socket);
        store.emit("init",{mss:"hello Store"});
        store.on('find:shipper', function (data) {

        })

    })

    admin.on('connection',function(socket){
        console.log("have connection in Admin :"+ socket);
        admin.emit("init",{mss:"hello Admin"});
    })

}