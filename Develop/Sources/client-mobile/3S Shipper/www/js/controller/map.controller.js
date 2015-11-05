/**
 * Created by Kaka Hoang Huy on 10/27/2015.
 */

// /*
//     Helper functions
// */
function initShipperMarker($scope, geocoder, maps, shipperMarker) {
  shipperMarker.icon = $scope.shipperIcon;
}

function initStoreMarker($scope, geocoder, maps, storeMarker) {
  storeMarker.icon = $scope.storeIcon;
  geocoder.geocode({
    'location': {
      lat: storeMarker.latitude,
      lng: storeMarker.longitude
    }
  }, function(results, status) {
    var geoText = 'Not Available';
    if (status === maps.GeocoderStatus.OK) {
      if (results[0]) {
        geoText = results[0].formatted_address;

      }
    }
    storeMarker.geoText = geoText;
  });
}

function initCustomerMarker($scope, geocoder, maps, customerMarker) {
  customerMarker.customerID = customerMarker.order[0];
  customerMarker.order.forEach(function(order) {
    $scope.orders[order].customerID = customerMarker.customerID;
  });

  customerMarker.icon = $scope.customerIcon;
  geocoder.geocode({
    address: customerMarker.geoText
  }, function(results, status) {
    if (status === maps.GeocoderStatus.OK) {
      customerMarker.latitude = results[0].geometry.location.lat();
      customerMarker.longitude = results[0].geometry.location.lng();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

var arrows = [];

function drawArrow(fromMarker, toMarker, symbol, color, maps, myMap) {
  //console.log(fromMarker, toMarker);
  arrows.push(new maps.Polyline({
    path: [fromMarker, toMarker],
    strokeColor: color,
    icons: [{
      icon: symbol,
      offset: '100%'
    }],
    map: myMap
  }));
}

function resetArrows() {
  arrows.forEach(function(arrow) {
    arrow.setMap(null);
  })
  arrows = [];
}

function displayRelationship(model, object_1, object_2, $scope) {
  // Display arrows
  /*
   model.order.forEach(function(order) {
   var store = _.find($scope.storeMarkers, function(e) {
   return e.storeID == $scope.orders[order].storeID;
   });
   var customer = _.find($scope.customerMarkers, function(e) {
   return e.customerID == $scope.orders[order].customerID;
   });

   var start = {
   lat: model.latitude,
   lng: model.longitude
   };
   //console.log(store, customer);
   $scope.drawTwoArrows(start, store, customer);
   });
   */

  model.order.forEach(function(order) {
    var dest_1 = _.find($scope[object_1 + "Markers"], function(e) {
      return e[object_1 + "ID"] == $scope.orders[order][object_1 + "ID"];
    });
    var dest_2 = _.find($scope[object_2 + "Markers"], function(e) {
      return e[object_2 + "ID"] == $scope.orders[order][object_2 + "ID"];
    });

    var start = {
      lat: model.latitude,
      lng: model.longitude
    };
    //console.log(store, customer);
    if (dest_1 && dest_2)
      $scope.drawTwoArrows(start, dest_1, dest_2);
  });
}

// RUN ORDER: controller => link function
function mapController($scope,uiGmapGoogleMapApi,uiGmapIsReady,mapService){

  $scope.shipperMarkers = $scope.shipperMarkers || [];
  $scope.storeMarkers = $scope.storeMarkers || [];
  $scope.customerMarkers = $scope.customerMarkers || [];
  $scope.orders = $scope.orders || {};

  console.log($scope.shipperMarkers == mapService.getShipperMarkers());

  $scope.circleRadius = $scope.circleRadius || 1000000000;

  var initCenter = {
    latitude: 21.013419,
    longitude: 105.526180
  }

  $scope.center = $scope.center || initCenter;

  $scope.shipperControl = {};
  $scope.storeControl = {};
  $scope.customerControl = {};


  uiGmapGoogleMapApi.then(function(maps){

    /*
     Khởi tạo các biểu tượng:
     + Địa điểm đi
     + Địa điểm đến

     */
    $scope.shipperIcon = 'http://maps.google.com/mapfiles/kml/shapes/motorcycling.png';
    $scope.storeIcon = 'http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png';
    $scope.customerIcon = 'http://maps.google.com/mapfiles/kml/shapes/man.png';

    $scope.sourceIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=S|FFFF00|000000';
    $scope.disabledIcon = 'http://chart.apis.google.com/chart?' +
      'chst=d_map_pin_letter&chld=x|3366FF';

    $scope.arrowSymbol = {
      path: maps.SymbolPath.FORWARD_CLOSED_ARROW
    };


    /*
     Dùng để convert address => toạ độ
     Ngược lại dùng: revertgeocoder();
     */
    var geocoder = new maps.Geocoder;

    /*
     Dùng để tính toán các thông tin giữa 2 điểm origin (điểm đi)
     và destination (điểm đến)
     - Lưu ý: limit 25 origin / 25 destination per request
     */
    var distanceService = new maps.DistanceMatrixService;

    /*
     Dùng để tính đường đi của giữa các địa điểm
     */
    //var directionService = new maps.DirectionService;

    /*
     Dùng để set nội dung popup khi sự kiện click vào marker
     */
    var infoWindow = new maps.InfoWindow;

    /*
     Khởi tạo giá trị config ban đầu cho map
     */
    $scope.map = {
      center: $scope.center,
      zoom: 16,
      control: {},
      dragging: true
    }

    /*
     Khởi tạo current Location
     */
    $scope.currentLocation = {
      id: 1,
      coords: null,
      options : {
        visible: false,
        icon : $scope.sourceIcon
      }
    }


    // Initilize some attribute for markers
    $scope.shipperMarkers.forEach(function(shipperMarker) {
      initShipperMarker($scope, geocoder, maps, shipperMarker);
    });

    $scope.storeMarkers.forEach(function(storeMarker) {
      initStoreMarker($scope, geocoder, maps, storeMarker);
    });

    $scope.customerMarkers.forEach(function(customerMarker) {
      initCustomerMarker($scope, geocoder, maps, customerMarker);
    });


    // Events for markers
    $scope.shipperEvents = {
      mouseover: function(gMarker, eventName, model, mouseEvent) {
        console.log('mouseover', model.order);
        console.log('mouseover storeMarkers', $scope.storeMarkers);
        console.log('mouseover customerMarkers', $scope.customerMarkers);
        var content = '<div>' +
          '<h5>' + model.shipperID + '</h5>' +
          '<ul>';

        model.order.forEach(function(order) {
          content += '<li>' + order + '</li>';
        });

        content += '</ul>' +
          'Status: <span>' + model.status + '</span>' +
          '</div>';
        $scope.openInfo(gMarker, content);

        displayRelationship(model, "store", "customer", $scope);
      },

      mouseout: function(gMarker, eventName, model, mouseEvent) {
        infoWindow.close();
        resetArrows();
      }
    };
    $scope.storeEvents = {
      mouseover: function(gMarker, eventName, model, mouseEvent) {
        console.log('mouseover', model.order);
        var content = '<div>' +
          '<strong>' + model.geoText + '</strong>' +
          '<ul>';

        model.order.forEach(function(order) {
          content += '<li>' + order + '</li>';
        });

        content += '</ul>' +
          '</div>';
        $scope.openInfo(gMarker, content);

        displayRelationship(model, "shipper", "customer", $scope);
      },

      mouseout: function(gMarker, eventName, model, mouseEvent) {
        infoWindow.close();
        resetArrows();
      }
    };
    $scope.customerEvents = {
      mouseover: function(gMarker, eventName, model, mouseEvent) {
        var content = '<div>' +
          '<strong>' + model.geoText + '</strong>' +
          '<ul>';

        model.order.forEach(function(order) {
          content += '<li>' + order + '</li>';
        });

        content += '</ul>' +
          '</div>';
        $scope.openInfo(gMarker, content);

        displayRelationship(model, "shipper", "store", $scope);
      },

      mouseout: function(gMarker, eventName, model, mouseEvent) {
        infoWindow.close();
        resetArrows();
      }
    };

    // Test real-time

    // setTimeout(function() {
    //     console.log('time out');
    //     var newOrder = "order1";
    //     var shipperID = "shipper_1";
    //     var storeID = "store_3";
    //     var newStore = {
    //         "order": [newOrder],
    //         "latitude": 21.031526,
    //         "longitude": 105.813359,
    //         "storeID": storeID
    //     };
    //     var geoText = "306 Kim Mã,Ba Đình,Hà Nội,Việt Nam";
    //     var newCustomer = {
    //         "order": [newOrder],
    //         "geoText": geoText
    //     };
    //     initStoreMarker($scope, geocoder, maps, newStore);
    //     $scope.orders[newOrder] = {
    //         "shipperID": shipperID,
    //         "storeID": storeID
    //     };
    //     initCustomerMarker($scope, geocoder, maps, newCustomer);
    //     // Add all new information
    //     $scope.shipperMarkers[0].order.push(newOrder);
    //     $scope.storeMarkers.push(newStore);
    //     $scope.customerMarkers.push(newCustomer);
    //     $scope.$apply();
    // }, 5000);

    // Filling control for all angular-google-map directives
    uiGmapIsReady.promise().then(function(instances) {
      var myMap = instances[0].map;

      $scope.openInfo = function(gMarker, content) {
        infoWindow.setContent(content);
        infoWindow.open(myMap, gMarker);
      };

      $scope.drawTwoArrows = function(start, dest_1, dest_2) {
        var end = {
          lat: dest_1.latitude,
          lng: dest_1.longitude
        };
        drawArrow(start, end, $scope.arrowSymbol, 'blue', maps, myMap);

        var end = {
          lat: dest_2.latitude,
          lng: dest_2.longitude
        };
        drawArrow(start, end, $scope.arrowSymbol, 'blue', maps, myMap);
      };
    });

  });

  //$scope.$watch('$viewContentLoaded', function(event) {
  //    caplet();
  //});
}

mapController.$inject = ['$scope','uiGmapGoogleMapApi','uiGmapIsReady','mapService'];
app.controller('mapCtrl',mapController);
