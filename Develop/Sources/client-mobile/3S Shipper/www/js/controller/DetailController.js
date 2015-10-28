/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */

////START CONTROLLER MAP
// RUN ORDER: controller => link function
//function mapController($scope,uiGmapGoogleMapApi,uiGmapIsReady){
//  console.log(1);
//  $scope.shipperMarkers = $scope.shipperMarkers || [];
//  $scope.storeMarkers = $scope.storeMarkers || [];
//  $scope.customerMarkers = $scope.customerMarkers || [];
//  $scope.orders = $scope.orders || {};
//
//  $scope.circleRadius = $scope.circleRadius || 1000000000;
//
//  var initCenter = {
//    latitude: 21.029544,
//    longitude: 105.827340
//  }
//
//  $scope.center = $scope.center || initCenter;
//
//  $scope.shipperControl = {};
//  $scope.storeControl = {};
//  $scope.customerControl = {};
//
//
//  uiGmapGoogleMapApi.then(function(maps){
//
//    /*
//     Khởi tạo các biểu tượng:
//     + Địa điểm đi
//     + Địa điểm đến
//
//     */
//    $scope.shipperIcon = 'http://maps.google.com/mapfiles/kml/shapes/motorcycling.png';
//    $scope.storeIcon = 'http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png';
//    $scope.customerIcon = 'http://maps.google.com/mapfiles/kml/shapes/man.png';
//
//    $scope.sourceIcon = 'https://chart.googleapis.com/chart?' +
//      'chst=d_map_pin_letter&chld=S|FFFF00|000000';
//    $scope.disabledIcon = 'http://chart.apis.google.com/chart?' +
//      'chst=d_map_pin_letter&chld=x|3366FF';
//
//    $scope.arrowSymbol = {
//      path: maps.SymbolPath.FORWARD_CLOSED_ARROW
//    };
//
//
//    /*
//     Dùng để convert address => toạ độ
//     Ngược lại dùng: revertgeocoder();
//     */
//    var geocoder = new maps.Geocoder;
//
//    /*
//     Dùng để tính toán các thông tin giữa 2 điểm origin (điểm đi)
//     và destination (điểm đến)
//     - Lưu ý: limit 25 origin / 25 destination per request
//     */
//    var distanceService = new maps.DistanceMatrixService;
//
//    /*
//     Dùng để tính đường đi của giữa các địa điểm
//     */
//    //var directionService = new maps.DirectionService;
//
//    /*
//     Dùng để set nội dung popup khi sự kiện click vào marker
//     */
//    var infoWindow = new maps.InfoWindow;
//
//    /*
//     Khởi tạo giá trị config ban đầu cho map
//     */
//    $scope.map = {
//      center: $scope.center,
//      zoom: 16,
//      control: {},
//      dragging: true
//    }
//
//    /*
//     Khởi tạo current Location
//     */
//    $scope.currentLocation = {
//      id: 1,
//      coords: null,
//      options : {
//        visible: false,
//        icon : $scope.sourceIcon
//      }
//    }
//
//
//    // Initilize some attribute for markers
//    $scope.shipperMarkers.forEach(function(shipperMarker) {
//      initShipperMarker($scope, geocoder, maps, shipperMarker);
//    });
//
//    $scope.storeMarkers.forEach(function(storeMarker) {
//      initStoreMarker($scope, geocoder, maps, storeMarker);
//    });
//
//    $scope.customerMarkers.forEach(function(customerMarker) {
//      initCustomerMarker($scope, geocoder, maps, customerMarker);
//    });
//
//
//    // Events for markers
//    $scope.shipperEvents = {
//      mouseover: function(gMarker, eventName, model, mouseEvent) {
//        var content = '<div>' +
//          '<h5>' + model.shipperID + '</h5>' +
//          '<ul>';
//
//        model.order.forEach(function(order) {
//          content += '<li>' + order + '</li>';
//        });
//
//        content += '</ul>' +
//          'Status: <span>' + model.status + '</span>' +
//          '</div>';
//        $scope.openInfo(gMarker, content);
//
//        displayRelationship(model, "store", "customer", $scope);
//      },
//
//      mouseout: function(gMarker, eventName, model, mouseEvent) {
//        infoWindow.close();
//        resetArrows();
//      }
//    };
//    $scope.storeEvents = {
//      mouseover: function(gMarker, eventName, model, mouseEvent) {
//        var content = '<div>' +
//          '<strong>' + model.geoText + '</strong>' +
//          '<ul>';
//
//        model.order.forEach(function(order) {
//          content += '<li>' + order + '</li>';
//        });
//
//        content += '</ul>' +
//          '</div>';
//        $scope.openInfo(gMarker, content);
//
//        displayRelationship(model, "shipper", "customer", $scope);
//      },
//
//      mouseout: function(gMarker, eventName, model, mouseEvent) {
//        infoWindow.close();
//        resetArrows();
//      }
//    };
//    $scope.customerEvents = {
//      mouseover: function(gMarker, eventName, model, mouseEvent) {
//        var content = '<div>' +
//          '<strong>' + model.geoText + '</strong>' +
//          '<ul>';
//
//        model.order.forEach(function(order) {
//          content += '<li>' + order + '</li>';
//        });
//
//        content += '</ul>' +
//          '</div>';
//        $scope.openInfo(gMarker, content);
//
//        displayRelationship(model, "shipper", "store", $scope);
//      },
//
//      mouseout: function(gMarker, eventName, model, mouseEvent) {
//        infoWindow.close();
//        resetArrows();
//      }
//    };
//
//
//    //$scope.markersClone = _.cloneDeep($scope.markers);
//    //$scope.fromMarker   = "";
//    //$scope.toMarker     = "";
//    //
//    //$scope.removeMarker = function(index, marker){
//    //    $scope.markersClone.splice(index,1);
//    //}
//
//
//    // Test real-time
//
//    setTimeout(function() {
//      console.log('time out');
//      var newOrder = "order1";
//      var shipperID = "shipper_1";
//      var storeID = "store_3";
//      var newStore = {
//        "order": [newOrder],
//        "latitude": 21.031526,
//        "longitude": 105.813359,
//        "storeID": storeID
//      };
//      var geoText = "306 Kim Mã,Ba Đình,Hà Nội,Việt Nam";
//      var newCustomer = {
//        "order": [newOrder],
//        "geoText": geoText
//      };
//      initStoreMarker($scope, geocoder, maps, newStore);
//      $scope.orders[newOrder] = {
//        "shipperID": shipperID,
//        "storeID": storeID
//      };
//      initCustomerMarker($scope, geocoder, maps, newCustomer);
//
//      // Add all new information
//      $scope.shipperMarkers[0].order.push(newOrder);
//      $scope.storeMarkers.push(newStore);
//      $scope.customerMarkers.push(newCustomer);
//      $scope.$apply();
//    }, 5000);
//
//
//
//    // Filling control for all angular-google-map directives
//    uiGmapIsReady.promise().then(function(instances) {
//      var myMap = instances[0].map;
//
//
//      $scope.openInfo = function(gMarker, content) {
//        infoWindow.setContent(content);
//        infoWindow.open(myMap, gMarker);
//      };
//
//      $scope.drawTwoArrows = function(start, dest_1, dest_2) {
//        console.log('draw 22222');
//        var end = {
//          lat: dest_1.latitude,
//          lng: dest_1.longitude
//        };
//        drawArrow(start, end, $scope.arrowSymbol, 'blue', maps, myMap);
//
//        var end = {
//          lat: dest_2.latitude,
//          lng: dest_2.longitude
//        };
//        drawArrow(start, end, $scope.arrowSymbol, 'blue', maps, myMap);
//      };
//    });
//
//  });
//
//  //$scope.$watch('$viewContentLoaded', function(event) {
//  //    caplet();
//  //});
//}
//
//mapController.$inject = ['$scope','uiGmapGoogleMapApi','uiGmapIsReady'];
//app.controller('mapController',mapController);
////END CONTROLLER MAP
//
//app.directive('map',function(){
//  return {
//    controller: 'mapController',
//    templateUrl: '/components/map/map.html',
//    controllerAs: 'map',
//    replace: true,
//    restrict: 'E',
//    scope: {
//      shipperMarkers: '=',
//      storeMarkers: '=',
//      customerMarkers: '=',
//      orders: '=',
//      circleRadius: '='
//    }
//  }
//});
  app.directive('mapp', function () {
  return {
    restrict: 'AEC',
    scope: true,
    link: function (scope, element, attrs) {
      //scope.huy = "Kaka Hoang Huy2";
      //console.log(scope.user);
      var zValue = scope.$eval(attrs.zoom);
      var lat = scope.$eval(attrs.lat);
      var lng = scope.$eval(attrs.lng);

      var myLatlng = new google.maps.LatLng(lat, lng),
        mapOptions = {
          zoom: zValue,
          center: myLatlng
        },
        map = new google.maps.Map(element[0], mapOptions);
      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true
      });

      google.maps.event.addListener(marker, 'dragend', function (evt) {
        console.log('Current Latitude:', evt.latLng.lat(), 'Current Longitude:', evt.latLng.lng());
        scope.user.latitude = evt.latLng.lat();
        scope.user.longitude = evt.latLng.lng();
        console.log(scope.huy);
        scope.$apply();
        console.log("AA");
        //console.log($scope);
      });
    }
  };
});

 function detailController($scope, $stateParams, dataFactory, $cordovaGeolocation, $ionicPopup, $ionicModal, $ionicPopover, uiGmapGoogleMapApi,uiGmapIsReady) {

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

    //// START - functions area
    getCurrentPos().then(function (position) {
      $scope.userPosition.lat = position.coords.latitude;
      $scope.userPosition.lgt = position.coords.longitude;
      getDetailFromServer();
      //$ionicPopup.alert({
      //  title: "You're here",
      //  content: "Your postition: " + position.coords.latitude + " - " + position.coords.longitude
      //}).then(function (res) {
      //  console.log('Test Alert Box');
      //});
    }, function (err) {
      // error
    });

    getListStatusFromServer();

    function getListStatusFromServer() {
      var urlBase = config.hostServer + 'api/statuslist';
      dataFactory.getDataServer(urlBase)
        .success(function (rs) {
          $scope.statuslist = rs;
          //console.log(rs);
        })
        .error(function (error) {
          $scope.errorlogs += 'Unable to load order status list data: ' + error;
          console.log('Unable to load order status list data: ' + error);
        });
    }

    function getDetailFromServer() {
      var urlBase = config.hostServer + 'api/detail/' + $stateParams.orderId;
      dataFactory.getDataServer(urlBase)
        .success(function (rs) {
          $scope.order = rs;
          var points = [];
          var center = $scope.userPosition;
          points.push(center);
          if ($scope.order.pickupaddresscoordination) {
            points.push({
              lat: $scope.order.pickupaddresscoordination[0],
              lgt: $scope.order.pickupaddresscoordination[1]
            });
          }
          if ($scope.order.deliveryaddresscoordination) {
            points.push({
              lat: $scope.order.deliveryaddresscoordination[0],
              lgt: $scope.order.deliveryaddresscoordination[1]
            });
          }
          rebuildMap(points, center);

        })
        .error(function (error) {
          console.log('Unable to load customer data: ' + error);
        });
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
      dataFactory.putDataServer(urlBase, data)
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
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      //$scope.popover.show($event);
    };
    //// END POPOVER
    $scope.nextStepConfirm = function step(confirmationCode) {
      var urlBase = config.hostServer + 'api/nextstep/';
      var data = {
        confirmcode: confirmationCode,
        code: $scope.order.code
      };
      dataFactory.putDataServer(urlBase, data)
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
   var mode = "orderdetail";
   $scope.shippers = sampleData[mode].shipper;
   $scope.stores = sampleData[mode].store;
   $scope.customers = sampleData[mode].customer;
   $scope.orders = sampleData[mode].orders;

 };

detailController.$inject = ['$scope', '$stateParams', 'dataService', '$cordovaGeolocation', '$ionicPopup', '$ionicModal', '$ionicPopover', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];
app.controller('DetailCtrl',detailController);

var sampleData = {
  "all": {
    "shipper": [
      {
        "order" : ["order1"],
        "latitude": 21.028784,
        "longitude": 105.826088,
        "shipperID": "shipper_1",
        "status": "status 111",
        "currentDestination": {

        }
        /*
         "markerID"
         "geoText"
         "distance"
         "duration", // client

         "latitude"
         "longitude"
         "shipperID"
         "status"    // server
         */
      },
      {
        "order" : ["order3","order2"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      },
      {
        "order" : ["order4"],
        "latitude": 21.031918,
        "longitude": 105.826514,
        "shipperID": "shipper_3",
        "status": "status 333"
      }
    ],
    "store": [
      {
        "order" : ["order1","order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      },
      {
        "order" : ["order3","order4"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order" : ["order1","order3"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"

        /*
         "geoText"
         */
      },
      {
        "order" : ["order2"],
        "geoText": "76 An Trạch,Cát Linh,Đống Đa,Hà Nội, Việt Nam"
      },
      {
        "order" : ["order4"],
        "geoText": "112 Giảng Võ,Đống Đa,Hà Nội,Việt Nam"
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
      },
      "order3": {
        "shipperID": "shipper_2",
        "storeID": "store_2"
      },
      "order4": {
        "shipperID": "shipper_3",
        "storeID": "store_2"
      }
    }
  },

  "shipper" : {   // detail of shipper_2
    "shipper": [
      {
        "order" : ["order2","order3"],
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

  "store" : {     // detail of store_1
    "shipper": [
      {
        "order" : ["order1"],
        "latitude": 21.028784,
        "longitude": 105.826088,
        "shipperID": "shipper_1",
        "status": "status 111"
      },
      {
        "order" : ["order2"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store":[
      {
        "order": ["order1","order2"],
        "latitude": 21.025869,
        "longitude": 105.826310,
        "storeID": "store_1"
      }
    ],
    "customer":[
      {
        "order" : ["order1"],
        "geoText": "Cát Linh,Ba Đình,Hà Nội,Việt Nam"
      },
      {
        "order" : ["order2"],
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
        "order" : ["order3"],
        "latitude": 21.029434,
        "longitude": 105.832050,
        "shipperID": "shipper_2",
        "status": "status 222"
      }
    ],
    "store": [
      {
        "order" : ["order3"],
        "latitude": 21.026700,
        "longitude": 105.823510,
        "storeID": "store_2"
      }
    ],
    "customer": [
      {
        "order" : ["order3"],
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
