/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */

function detailController($scope, $stateParams, dataService, $cordovaGeolocation, $ionicPopup, $ionicPopover, uiGmapGoogleMapApi, uiGmapIsReady, $rootScope, $ionicLoading, mapService, authService) {  
  $scope.isCancel = $stateParams.isCancel;
  $scope.shippers = mapService.getShipperMarkers();
  $scope.stores = mapService.getStoreMarkers();
  $scope.customers = mapService.getCustomerMarkers();
  $scope.orders = mapService.getOrders();
  var currentUser = authService.getCurrentInfoUser();
  $scope.center = {
      // :TODO get address of shipper
      //latitude: currentUser.latitude,
      //longitude: currentUser.longitude
      latitude: 21.013419,
      longitude: 105.526180
  };
  //shipper category of issue = cancel
  if ($scope.isCancel == "true") {
    $scope.isBackdropShowing = false;
    $scope.show = function(){
      $ionicLoading.show({
        templateUrl: 'loading.html',
        scope: $scope
      });
    };
    $scope.show();
    $scope.hide = function(){
      $ionicLoading.hide();
    }
  }

  $scope.showConfirm = function (currentStatus, action) {
    $scope.action = action;
    $scope.statuslist.map(function (st) {
        if (st.statusid == currentStatus) {
          if (st.requiredcode) {
            confirmNextCode(action);
          } else {
            confirmNext(action);
          }
        }
      }
    );
  };

  var confirmNext = function (action) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm next step',
      template: 'Are you sure you want to ' + action.toLowerCase() + '?'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $scope.nextStep();
      }
    });
  };

  var confirmNextCode = function (action) {
    $scope.confirm = {};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="confirm.code">',
      title: 'Enter confirmation code',
      subTitle: 'Enter code to ' + action.toLowerCase(),
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.confirm.code) {
              e.preventDefault();
            } else {
              return $scope.confirm.code;
            }
          }
        }
      ]
    });
    myPopup.then(function (code) {
      if(code) $scope.nextStepConfirm(code);
    });
  };  

  getDetailFromServer();

  function getDetailFromServer() {
    var urlBase = config.hostServer + 'api/shipper/detail?taskid=' + $stateParams.orderId;
    dataService.getDataServer(urlBase)
      .then(function (rs) {
        rs = rs.data;
        if(rs) {
          $scope.order = rs.detail;
          console.log("DETAIL: ",$scope.order);
          $scope.statuslist = rs.statuslist;

          // Filter map data
          var mode = { type: 'orderdetail', orderID: $scope.order.orderid };
          mapService.setMode(mode);
        }
      });
  }

  function getMapData() {
    var urlBase = config.hostServer + 'api/shipper/mapdata/' + $stateParams.orderId;
    //dataService.getDataServer(urlBase).then(function (dataMap) {
    //  dataMap = dataMap.data;
    ////initStoreMarker($scope, geocoder, maps, newStore);
    //$scope.orders[newOrder] = {
    //  "shipperID": shipperID,
    //  "storeID": storeID
    //};
    ////initCustomerMarker($scope, geocoder, maps, newCustomer);
    //// Add all new information
    //$scope.shippers[0].order.push(newOrder);
    //$scope.stores.push(newStore);
    //$scope.customers.push(newCustomer);
    ////$scope.$apply();


    //$scope.dataMap = dataMap.data;
    //$scope.shippers = $scope.dataMap.shipper;
    //$scope.stores = $scope.dataMap.store;
    //$scope.customers = $scope.dataMap.customer;
    //$scope.orders = $scope.dataMap.order;
    //getCurrentPos().then(function (position) {
    //  $scope.dataMap.shipper[0]["latitude"] = position.coords.latitude;
    //  $scope.dataMap.shipper[0]["longitude"] = position.coords.longitude;
    //  console.log("data",$scope.dataMap);
    //});
    //}, function (err) {
    //  $scope.errorlogs += 'Unable to load order status list data: ' + err;
    //  console.log('Unable to load order status list data: ' + err);
    //})
  }

  //// HuyTDH - 25-10-15
  //// Next step without confirmation code
  $scope.nextStep = function step() {
    var urlBase = config.hostServer + 'api/shipper/nextstep/';
    var data = {
      code: $scope.order.orderid,
      confirmcode: '',
      taskid: $stateParams.orderId
    };
    dataService.putDataServer(urlBase, data)
      .then(function (rs) {
        $ionicPopup.alert({
          title: "Successfully!",
          content: rs.data
        }).then(function (ok) {
          //Reload
          getDetailFromServer();
        });
      },
      function (err) {
        $ionicPopup.alert({
          title: "Can not go to next step of order",
          content: "Error: " + err.data
        })
      });
  };

  $scope.nextStepConfirm = function step(confirmationCode) {
    var urlBase = config.hostServer + 'api/shipper/nextstep/';
    var data = {
      confirmcode: confirmationCode,
      code: $scope.order.orderid,
      taskid: $stateParams.orderId
    };
    dataService.putDataServer(urlBase, data)
      .then(function (rs) {
        $ionicPopup.alert({
          title: "Successfully!",
          content: rs.data
        }).then(function (rs) {
          //Reload
        getDetailFromServer();
        });
      },
      function (err) {
        $ionicPopup.alert({
          title: "Can not go to next step of order",
          content: "Error: " + err.data
        })
      });
  };

  //// POPOVER (TOOLTIP)
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('status-popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function ($event) {
    //$scope.popover.show($event);
  };
  //// END POPOVER

  function getCurrentPos() {
    var posOptions = {timeout: 1000, enableHighAccuracy: true};
    return $cordovaGeolocation
      .getCurrentPosition(posOptions)
  }

  function rebuildMap(points, centerPoint) {
    return;
    var myLatlng = new google.maps.LatLng(centerPoint.lat, centerPoint.lgt),
      mapOptions = {
        zoom: 10,
        center: myLatlng
        //mapTypeId: google.maps.MapTypeId.SATELLITE
      },
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
    points.map(function (point) {
      marker = new google.maps.Marker({
        //icon: "assets/images/blue_marker_2.png",
        position: new google.maps.LatLng(point.lat, point.lgt),
        map: map,
        options: {
          "labelContent": "Dragged lat: 16.983875718813415 lon: -81.57031250000006",
          "labelAnchor": "22 0",
          "labelClass": "marker-labels",
          "draggable": false
        }
      })
    })
  }

  //socket
  //Socket on grab express order
  $scope.$on("shipper:express:order:success", function(event, args) {
    var des = {
      id: 999,
      content: 'You just grab a new order!s'
    };
    console.log('success success showAlert');
    $scope.showAlert(des);
  });

  //show alert
  $scope.showAlert = function(des) {
    var alertPopup = $ionicPopup.alert({
      title: 'Information',
      template: des.content
    });
    alertPopup.then(function(res) {
      //reload data
      console.log("You got it");
      // getListOfTask();
    });
  };

  //// END - functions area
}

detailController.$inject = ['$scope', '$stateParams', 'dataService', '$cordovaGeolocation', '$ionicPopup', '$ionicPopover', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$rootScope', '$ionicLoading', 'mapService', 'authService'];
app.controller('DetailCtrl', detailController);
