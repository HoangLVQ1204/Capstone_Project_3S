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
        store.emit("init",{mss:"hello Store"});
        socket.on('find:shipper', function (data) {

        })

    })

    admin.on('connection',function(socket){
        console.log("have connection in Admin");
        console.log(Object.keys(admin.connected));
        admin.emit("init",{mss:"hello Admin"});
    })



    shipper.on('connection',function(socket){

        console.log(Object.keys(shipper.connected));
        console.log("IO: "+Object.keys(io.sockets.connected));

        io.sockets.connected[socket.id].emit("hello","Hello Admin!");

        console.log("have connection in Shipper");
        socket.on('shipper:send:location',function(info){
            console.log("xxx");
            console.log(info);

            //var isNewShipper = false;
            //if(!listShipper.hasOwnProperty(info.shipperID)){
            //    isNewShipper = true;
            //}
            //socketConnection[info.shipperID] = socket;
            //listShipper[info.shipperID] = {
            //    shipperID: info.shipperID,
            //    lat: info.lat,
            //    lng: info.lng,
            //    status: info.status // 0: free, 1: busy
            //};
            //socket.broadcast.emit('shipper:send:location:admin',{
            //    shipperID: info.shipperID,
            //    lat: info.lat,
            //    lng: info.lng,
            //    status: info.status,
            //    isNew: isNewShipper
            //});
            //Object.keys()



        })
    })
}