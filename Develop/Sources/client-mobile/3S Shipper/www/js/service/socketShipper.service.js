/**
 * Created by Kaka Hoang Huy on 11/08/15.
 */


function socketShipper($rootScope, $q,socketService,authService,mapService, $ionicLoading, $timeout) {


  var EPSILON = 1e-8;

  var currentLocation = null;
  var api = {};

  /*
   add handlers
   */

  socketService.on('shipper:register:location', function(data) {
    mapService.setMapData(data.msg.mapData)
      .then(function() {
        console.log('register', data);
      });
  });

  //receive message after admin resolved issue
  socketService.on('shipper:issue:resolve', function(data) {
    console.log('shipper:issue:resolve', data.msg.notification);
    //$rootScope.$broadcast('issue:resolve', {type: data.msg.type, content: data.msg.notification.content});
    $rootScope.$broadcast('issue:resolve', {type: data.msg.type});
  });

  socketService.on('shipper:choose:express', function(data) {
    //Ionic Loading
    $rootScope.show = function() {
      $ionicLoading.show({
        template: '<div class="popup">' +
        '<div class="popup-head" style="background-color: rgb(239, 71, 58);'  +
        'border-radius: 5px;border-bottom: 1px solid rgb(239, 71, 58);padding: 12px 10px">' +
        '<h3 class="popup-title" style="font-size: 1.2em; font-weight: bold;">Grab</h3>' +
        '</div>' +
        '<div class="popup-body">' +
        '<span style="font-size: 2.5em; display: block; margin: 7px 0">{{counter}}</span>' +
        '<div id="graborder">' +
        '<p>Có một đơn hàng ở địa cách đây {{data.msg.distanceText}}.</p>' +
        '<p>Bạn có muốn nhận đơn hàng này ?</p>' +
        '</div>' +
        '</div>' +
        '<div class="popup-buttons">' +
        '<a href="#" ng-click="stop(true)" class="button btn-default-cus" >Cancel</a>' +
        '<a ng-click="grabExpressOrder()" class="button btn-success-cus btn-default-cus">Grab</a>' +
        '</div>' +
        '</div>',
        scope: $rootScope
      });
    };

    $rootScope.hide = function(){
      $rootScope.isGrabbing = false;
      console.log("hide");
      $ionicLoading.hide();
    };
    //Grab Express Order
    if(!$rootScope.isGrabbing) {
      $rootScope.isGrabbing = true;
      $rootScope.counter = 20;
      $rootScope.data = data;
      /*20s*/
      $rootScope.onTimeout = function () {
        $rootScope.counter--;
        mytimeout = $timeout($rootScope.onTimeout, 1000);
        if ($rootScope.counter == 0) {
          $rootScope.stop(true);
        }
      };
      var mytimeout = $timeout($rootScope.onTimeout, 1000);

      $rootScope.stop = function (sendSocket) {
        $timeout.cancel(mytimeout);
        $rootScope.hide();
        if (sendSocket) {
          var currentUser = authService.getCurrentInfoUser();
          socketService.sendPacket(
            {
              type: 'shipper',
              clientID: currentUser.username
            },
            'server',
            {
              shipper: {
                shipperID: currentUser.username
              }
            },
            'shipper:reject:order');
        }
      };
      $rootScope.show();
    }else{
      // TODO: Wait until modal hide
    }
    //var answer = confirm('Do you want to accept order from store of ' + data.msg.distanceText + ' away?');
    //var answer = false;

    $rootScope.grabExpressOrder = function() {
      console.log('fc grabExpressOrder');
      console.log('data recieve', data);
      api.getCurrentUser()
        .then(function(user) {
          user.distanceText = data.msg.distanceText;
          user.durationText = data.msg.durationText;
          authService.getProfileUser()
            .then(function(res){
              user.fullName    = res.data.name;
              user.avatar      = res.data.avatar;
              user.phonenumber = res.data.phonenumber;
              console.log("-- DATA BEFORE SEND --");
              console.log(res);
              console.log("-- DATA BEFORE SEND --");

              socketService.sendPacket(
                {
                  type: 'shipper',
                  clientID: user.shipperID
                },
                data.sender,
                {
                  shipper: user
                },
                'shipper:choose:express');
                $rootScope.stop();
            });
        })
        .catch(function(err) {
          console.log(err);
        });
    };
    //if (answer) {
    //  api.getCurrentUser()
    //    .then(function(user) {
    //      socketService.sendPacket(
    //        {
    //          type: 'shipper',
    //          clientID: user.shipperID
    //        },
    //        data.sender,
    //        {
    //          shipper: user
    //        },
    //        'shipper:choose:express');
    //    })
    //    .catch(function(err) {
    //      alert(err);
    //    });
    //}
  });

  socketService.on('shipper:add:order', function(data) {
    var msg = data.msg;
    mapService.addOrder(msg.orderID, msg.store, msg.shipper, msg.customer)
      .then(function() {
        console.log('shipper add order', data);
        // alert('You have one express order from store ' + msg.store.storeID);
        // console.log('after add order', mapService.getStoreMarkers(), mapService.getCustomerMarkers(), mapService.getOrders());
      });

    $rootScope.$emit('shipper:express:order:success', msg);
  });

  socketService.on('shipper:remove:express', function(data) {
    console.log('remove express', data);
    $rootScope.stop();
    alert('Store ' + data.msg.store.storeID + ' has found a shipper or canceled order');
  });

  api.getCurrentUser = function() {
    var currentUser = authService.getCurrentInfoUser();

    d = $q.defer();
    navigator.geolocation.getCurrentPosition(function(position){
      var dataShipper = {
        shipperID: currentUser.username,
        status: currentUser.workingstatusid
      };
      currentLocation = position.coords;
      dataShipper.latitude = position.coords.latitude;
      dataShipper.longitude = position.coords.longitude;

      d.resolve(dataShipper);
    },function(){
      d.reject("Can't get your current location! Please check your connection");
    });

    return d.promise;
  };

  api.watchCurrentPosition = function() {
    var geo_success = function(position) {
      // if (currentLocation
      //     && Math.abs(currentLocation.latitude - position.coords.latitude) <= EPSILON
      //     && Math.abs(currentLocation.longitude - position.coords.longitude) <= EPSILON) {
      //     console.log('the same location');
      //     return;
      // }
      console.log('different location');
      currentLocation = position.coords;
      var currentUser = authService.getCurrentInfoUser();
      socketService.sendPacket(
        {
          type: 'shipper',
          clientID: currentUser.username
        },
        ['admin', { room: currentUser.username }],
        {
          shipper: {
            shipperID: currentUser.username,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          }
        },
        'shipper:update:location');
    };

    var geo_failure = function(err) {
      console.log('geo_failure', err);
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : Infinity,
      timeout           : Infinity
    };

    if (navigator.geolocation) {
      return navigator.geolocation.watchPosition(geo_success, geo_failure, geo_options);
    }
  };

  api.stopWatchCurrentPosition = function(watchID) {
    navigator.geolocation.clearWatch(watchID);
  };

  api.registerSocket = function(){
    api.getCurrentUser()
      .then(function(user) {
        mapService.addShipper(user)
          .then(function() {
            socketService.sendPacket(
              {
                type: 'shipper',
                clientID: user.shipperID
              },
              'server',
              {
                shipper: user
              },
              'client:register');

            // Test watch position
            // var watchID = api.watchCurrentPosition();
            // setTimeout(function() {
            //     console.log('stop watch');
            //     api.stopWatchCurrentPosition(watchID);
            // }, 10000);
          }, function(err){
            console.log(":Fail " + err);
          });
      },function(err){
        console.log(":FailGetUser " + err);
      })
      .catch(function(err){
        console.log(":Failllll " + err);
      });
  };

  return api;
}

socketShipper.$inject = ['$rootScope', '$q','socketService','authService','mapService', '$ionicLoading', '$timeout'];
app.factory('socketShipper', socketShipper);
