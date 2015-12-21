/**
 * Created by hoanglvq on 10/25/15.
 */
app
  .factory('socketService',function($rootScope, $q, $state){
    // var socket = io(config.hostServer);
    var socket = null;

    //socket.on('connect',function(){
    //  socket
    //    .on('authenticated',function(){
    //      console.log("Authen ok!");
    //    })
    //    .emit('authenticate',{token: localStorage.getItem('EHID')});
    //})
    // console.log('abc');
    // socket.on('disconnect', function() {
    //   console.log('DISCONNECTED');
    // });

    // socket.on('connect_error', function() {
    //   console.log('error');
    //   $state.go('sign-in');
    // });

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
      if (socket == null) socket = io(config.hostServer);
      var d = $q.defer();
      if (socket.connected) {
        console.log('socket is already connected');
        d.resolve();
        return d.promise;
      }
      socket.connect();
      socket.on('connect', function() {
        console.log('CONNECTED');
        d.resolve();
      });
      return d.promise;
    };

    //socket.on('connect', function() {
    //  console.log('ssssssss');
    //});
    return api;

  });
