/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */

function detailController($scope, $stateParams, dataService, $cordovaGeolocation, $ionicPopup, $ionicModal, $ionicPopover, uiGmapGoogleMapApi, uiGmapIsReady, $rootScope, $ionicLoading) {

  $scope.isCancel = $stateParams.isCancel;
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

  {

    var dataSamp =
    {
      "shipper": [
        {
          "order": ["order3"],
          "latitude": 21.026700,
          "longitude": 105.823510,
          "shipperID": "huykool",
          "status": "status 222"
        }
      ],
      "store": [
        {
          "order": ["order3"],
          "latitude": 21.025869,
          "longitude": 105.826310,
          "storeID": "str3"
        }
      ],
      "customer": [
        {
          "order": ["order3"],
          "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
        } ],
      "order": {
        "order3": {
          "shipperID": "huykool",
          "storeID": "str3"
        }
      }
    };
    dataSamp = {
      shipper: [
        {
          order: [
            "ord3"
          ],
          latitude: 21.0287,
          longitude: 105.83851,
          shipperID: "huykool"
        }
      ],
      store: [
        {
          order: [
            "ord3"
          ],
          latitude: 21.0267,
          longitude: 105.82351,
          storeID: "str3"
        }
      ],
      customer: [
        {
          order: [
            "ord3"
          ],
          geoText: "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
        }
      ],
      order: {
        ord3: {
          shipperID: "huykool",
          storeID: "str3"
        }
      }
    };
    $scope.shippers = dataSamp.shipper;
    $scope.stores = dataSamp.store;
    $scope.customers = dataSamp.customer;
    $scope.orders = dataSamp.order;
    console.log("dataLoaded");
    $scope.$broadcast();
  };
  //// START - Initiate modal confirm when shipper go next step
  $ionicModal.fromTemplateUrl('confirm-code-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalCode = modal;
  });

  $ionicModal.fromTemplateUrl('confirm-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  //// END - Initiate modal confirm when shipper go next step

  //// START - Event of modal confirm
  $scope.openModal = function (currentStatus, action) {
    $scope.action = action;
    $scope.statuslist.map(function (st) {
        if (st.statusid == currentStatus) {
          if (st.requiredcode) {
            $scope.modalCode.show();
          } else {
            $scope.modal.show();
          }
        }
      }
    );
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
    $scope.modalCode.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });
  //// END - Event of modal confirm

  $scope.userPosition = {
    //lat: "21.012529248181444",
    //lgt: "105.52563034439083"
    lat: "0",
    lgt: "0"
  };

  $scope.statuslist = [];

  $scope.order = {};

  $scope.confirmcode = '';

  $scope.errorlogs = '';

  $scope.dataMap = {};
  //// START Initiate data for map
  //$scope.shippers = [
  //  {
  //    "order": [],
  //    "latitude": 21.029434,
  //    "longitude": 105.832050,
  //    "shipperID": "shipperID",
  //    "status": "status 222"
  //  }
  //];
  //$scope.stores = [];
  //$scope.customers = [];
  //$scope.orders = {};
  //// END Initiate data for map

  getDetailFromServer();

  getCurrentPos().then(function(position){
      console.log(position.latitude);
      console.log(position.longitude);
      //$scope.shippers[0]["latitude"] = position.latitude;
      //$scope.shippers[0]["longitude"] = position.longitude;
      //getMapData();
  });

  //getMapData();

  getListStatusFromServer();

  //// START - functions area

  function getListStatusFromServer() {
    var urlBase = config.hostServer + 'api/statuslist';
    dataService.getDataServer(urlBase)
      .success(function (rs) {
        $scope.statuslist = rs;
      })
      .error(function (error) {
        $scope.errorlogs += 'Unable to load order status list data: ' + error;
        console.log('Unable to load order status list data: ' + error);
      });
  }

  function getDetailFromServer() {
    var urlBase = config.hostServer + 'api/detail/' + $stateParams.orderId;
    dataService.getDataServer(urlBase)
      .success(function (rs) {
        $scope.order = rs;
        //var points = [];
        //var center = $scope.userPosition;
        //points.push(center);
        //if ($scope.order.pickupaddresscoordination) {
        //  points.push({
        //    lat: $scope.order.pickupaddresscoordination[0],
        //    lgt: $scope.order.pickupaddresscoordination[1]
        //  });
        //}
        //if ($scope.order.deliveryaddresscoordination) {
        //  points.push({
        //    lat: $scope.order.deliveryaddresscoordination[0],
        //    lgt: $scope.order.deliveryaddresscoordination[1]
        //  });
        //}
        //rebuildMap(points, center);

      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  getMapData();
  $scope.center = {
    latitude: 21.0287,
    longitude: 105.83851
  };
  function getMapData() {
    var urlBase = config.hostServer + 'api/mapdata/' + $stateParams.orderId;
    //dataService.getDataServer(urlBase).then(function (dataMap) {
    //  dataMap = dataMap.data;
      //var newOrder = "order2";
      //var shipperID = "shipper_2";
      //var storeID = "store_3";
      //var newStore = {
      //  "order": [newOrder],
      //  "latitude": 21.031526,
      //  "longitude": 105.813359,
      //  "storeID": storeID
      //};
      //var geoText = "306 Kim Mã,Ba Đình,Hà Nội,Việt Nam";
      //var newCustomer = {
      //  "order": [newOrder],
      //  "geoText": geoText
      //};
      ////initStoreMarker($scope, geocoder, maps, newStore);
      //$scope.orders[newOrder] = {
      //  "shipperID": shipperID,
      //  "storeID": storeID
      //};
      ////initCustomerMarker($scope, geocoder, maps, newCustomer);
      //
      //// Add all new information
      //$scope.shippers[0].order.push(newOrder);
      //$scope.stores.push(newStore);
      //$scope.customers.push(newCustomer);
      ////$scope.$apply();

      setTimeout(function(){

      var dataSamp =
      {
        "shipper": [
          {
            "order": ["order3"],
            "latitude": 21.026700,
            "longitude": 105.823510,
            "shipperID": "huykool",
            "status": "status 222"
          }
        ],
        "store": [
          {
            "order": ["order3"],
            "latitude": 21.025869,
            "longitude": 105.826310,
            "storeID": "str3"
          }
        ],
        "customer": [
          {
            "order": ["order3"],
            "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
          } ],
        "order": {
          "order3": {
            "shipperID": "huykool",
            "storeID": "str3"
          }
        }
      };
    dataSamp = {
      shipper: [
        {
          order: [
            "ord3"
          ],
          latitude: 21.0287,
          longitude: 105.83851,
          shipperID: "huykool"
        }
      ],
      store: [
        {
          order: [
            "ord3"
          ],
          latitude: 21.0267,
          longitude: 105.82351,
          storeID: "str3"
        }
      ],
      customer: [
        {
          order: [
            "ord3"
          ],
          geoText: "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
        }
      ],
      order: {
        ord3: {
          shipperID: "huykool",
          storeID: "str3"
        }
      }
    };
      $scope.shippers = dataSamp.shipper;
      $scope.stores = dataSamp.store;
      $scope.customers = dataSamp.customer;
      $scope.orders = dataSamp.order;
      console.log("dataLoaded");
        $scope.$broadcast();
      },10000000);

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

  $scope.saveDetails = function mapdr() {
    var lat = $scope.user.latitude;
    var lgt = $scope.user.longitude;
    var des = $scope.user.desc;
    console.log($scope.huy);
    //GEOLOCATION

  };

  $scope.nextStep = function step(currentStatus) {
    var urlBase = config.hostServer + 'api/nextstep/';
    var data = {
      code: $scope.order.code,
      confirmcode: ''
    };
    dataService.putDataServer(urlBase, data)
      .then(function (rs) {
        $scope.modal.hide();
        $ionicPopup.alert({
          title: "Successfully!",
          content: "You're order has been moved to next step! Continue your work! :D"
        }).then(function (rs) {
          //Reload
          getDetailFromServer();
        });
        /*
         var myPopup = $ionicPopup.show({
         template: '<input type="password" ng-model="data.wifi">',
         title: 'Enter Wi-Fi Password',
         subTitle: 'Please use normal things',
         scope: $scope,
         buttons: [
         { text: 'Cancel' },
         {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
         if (!$scope.data.wifi) {
         //don't allow the user to close unless he enters wifi password
         e.preventDefault();
         } else {
         return $scope.data.wifi;
         }
         }
         },
         ]
         });
         myPopup.then(function(res) {
         console.log('Tapped!', res);
         });
         $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
         }, 3000);*/
      },
      function (err) {
        $scope.modal.hide();
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
  $scope.nextStepConfirm = function step(confirmationCode) {
    var urlBase = config.hostServer + 'api/nextstep/';
    var data = {
      confirmcode: confirmationCode,
      code: $scope.order.code
    };
    dataService.putDataServer(urlBase, data)
      .then(function (rs) {
        $scope.closeModal();
        $ionicPopup.alert({
          title: "Successfully!",
          content: "You're order has been moved to next step! Continue your work! :D"
        }).then(function (rs) {
          //Reload
          getDetailFromServer();
        });
      },
      function (err) {
        $scope.closeModal();
        $ionicPopup.alert({
          title: "Can not go to next step of order",
          content: "Error: " + err.data
        })
      });
  };

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
      //console.log(point);
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

  //// END - functions area
  //$scope.shippers = sampleData['shipper'].shipper;
  //$scope.stores = sampleData['shipper'].store;
  //$scope.customers = sampleData['shipper'].customer;
  //$scope.orders = sampleData['shipper'].orders;
  //console.log("controller loaded", $scope.orders);
  //setTimeout(function(){
  //  $scope.orders = {};
  //  $scope.customers = [];
  //  $scope.stores = [];
  //  $scope.shippers = [];
  //
  //  //console.log("controller loaded", $scope.orders);
  //},3000);
  //setTimeout(function(){
  //  $scope.shippers = sampleData['all'].shipper;
  //  $scope.stores = sampleData['all'].store;
  //  $scope.customers = sampleData['all'].customer;
  //  $scope.orders = sampleData['all'].orders;
  //  console.log("controller loaded", $scope.orders);
  //},5000);
  //var t = 0;
  //setInterval(function() {
  //  //console.log('time out');
  //  //$scope.shippers = []; //sampleData['all'].shipper;
  //  //$scope.stores =[]; //sampleData['all'].store;
  //  //$scope.customers = [];//sampleData['all'].customer;
  //  //$scope.orders = {};//sampleData['all'].orders;
  //  console.log("Reload time",t++);
  //  $scope.shippers = [{
  //    "order": ["order3"],
  //    "latitude": 21.029434 + 0.1*t,
  //    "longitude": 105.832050 + 0.1*t,
  //    "shipperID": "shipper_2",
  //    "status": "status 222"
  //  }];
  //
  //  //$scope.stores = sampleData['all'].store;
  //  //$scope.customers = sampleData['all'].customer;
  //  //$scope.orders = sampleData['all'].orders;
  //},2000);
  //setInterval(function(){ alert("Hello"); }, 3000);
}

detailController.$inject = ['$scope', '$stateParams', 'dataService', '$cordovaGeolocation', '$ionicPopup', '$ionicModal', '$ionicPopover', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$rootScope', '$ionicLoading'];
app.controller('DetailCtrl', detailController);

var sampleData = {
  "all": {
    "shipper": [
      {
        "order": ["order3"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store": [
      {
        "order": ["order3"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order": ["order3"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      }
    ],
    "orders": {
      "order3": {
        "shipperID": "shipper_2",
        "storeID": "store_2"
      }
    }
  },

  "shipper": {   // detail of shipper_2
    "shipper": [
      {
        "order": ["order2", "order3"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store": [
      {
        "order": ["order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      },
      {
        "order": ["order3"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order": ["order3"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      },
      {
        "order": ["order2"],
        "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
      }
    ],
    "orders": {
      "order2": {
        "shipperID": "shipper_2",
        "storeID": "store_1"
      },
      "order3": {
        "shipperID": "shipper_2",
        "storeID": "store_2"
      }
    }
  },

  "store": {     // detail of store_1
    "shipper": [
      {
        "order": ["order1"],
        "latitude": 21.028784,
        "longitude": 105.826088,
        "shipperID": "shipper_1",
        "status": "status 111"
      },
      {
        "order": ["order2"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store": [
      {
        "order": ["order1", "order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      }
    ],
    "customer": [
      {
        "order": ["order1"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      },
      {
        "order": ["order2"],
        "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
      }
    ],
    "orders": {
      "order1": {
        "shipperID": "shipper_1",
        "storeID": "store_1"
      },
      "order2": {
        "shipperID": "shipper_2",
        "storeID": "store_1"
      }
    }
  },

  "orderdetail": {
    "shipper": [
      {
        "order": ["order3"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store": [
      {
        "order": ["order3"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order": ["order3"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      }
    ],
    "orders": {
      "order3": {
        "shipperID": "shipper_2",
        "storeID": "store_2"
      }
    }
  }
};
