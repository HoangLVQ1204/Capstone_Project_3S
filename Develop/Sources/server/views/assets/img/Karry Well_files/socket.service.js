/**
 * Created by hoanglvq on 10/25/15.
 */
angular.module('app')
    .factory('socketService',function($rootScope){
        var socket = io();

        socket.on('connect',function(){
            console.log("connect client");
            console.log("SEND TOKEN: "+ localStorage.getItem('EHID'));
            socket
                .emit('authenticate',{token: localStorage.getItem('EHID')})
                .on('authenticated',function(){
                    console.log("Authen ok!");
                })
        })

        return {
            on: function (eventName, callback){
                socket.on(eventName,function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket,args);
                    })
                })
            },
            emit: function (eventName,data,callback){
                socket.emit(eventName,data,function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        if(callback){
                            callback.apply(socket,args);
                        }
                    })
                })
            },
            /*
                sender: { type: xxx, clientID: xxx }
                receiver = 'admin' || 'shipper' || 'store' || {room: ...} || { type: xxx, clientID: xxx} || Arrays of these types
                
            */
            sendPacket: function(sender, receiver, msg, eventName, callback) {
                var data = {
                    sender: sender,
                    receiver: receiver,
                    msg: msg
                };
                this.emit(eventName, data, callback);
            },

            initSocket: function(){

            }
        }
    })