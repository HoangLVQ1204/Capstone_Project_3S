/**
 * Created by hoanglvq on 10/25/15.
 */


angular.module('app')
    .factory('socketService',function($rootScope, $q){
        var socket = io();        
        // console.dir(socket);
        // socket.on('connect',function(){
        //     console.log("connect client");            
            // socket
            //     .emit('authenticate',{token: localStorage.getItem('EHID')})
            //     .on('authenticated',function(){
            //         console.log("Authen ok!");
                // })
        // })
        
        socket.on('disconnect', function() {
            console.log('DISCONNECTED');
        });
        
        var api = {};

        api.authenSocket = function(){
            return api.connect()
            .then(function() {
                console.log("SEND TOKEN: "+ localStorage.getItem('EHID'));
                var d = $q.defer();
                api.on('authenticated',function(){
                    console.log("Authen ok!");
                    d.resolve();
                });
                api.emit('authenticate',{token: localStorage.getItem('EHID')})
                return d.promise;
            });
        };

        api.on = function (eventName, callback){
            socket.on(eventName,function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket,args);
                })
            })
        };

        api.emit = function (eventName,data,callback){
            socket.emit(eventName,data,function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket,args);
                    }
                })
            })
        };
        /*
            sender: { type: xxx, clientID: xxx }
            receiver = 'admin' || 'shipper' || 'store' || {room: ...} || { type: xxx, clientID: xxx} || Arrays of these types
            
        */
        api.sendPacket = function(sender, receiver, msg, eventName, callback) {
            var data = {
                sender: sender,
                receiver: receiver,
                msg: msg
            };
            api.emit(eventName, data, callback);
        };

        api.disconnect = function() {
            // console.log('socket.disconnect', socket.disconnect);
            socket.disconnect();
        };

        api.connect = function() {
            if (socket.connected) {
                console.log('socket is already connected');
                return;
            }
            socket.connect();
            var d = $q.defer();
            socket.on('connect', function() {
                console.log('CONNECTED');
                d.resolve();
            });
            return d.promise;
        };

        return api;
    })