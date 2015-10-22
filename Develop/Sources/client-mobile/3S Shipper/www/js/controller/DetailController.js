/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */

app.directive('map', function () {
  return {
    restrict: 'AEC',
    scope: true,
    link: function (scope, element, attrs) {
      //scope.huy = "Kaka Hoang Huy2";
      console.log(scope.user);
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
})
  .controller('DetailCtrl', ['$scope', '$stateParams', 'dataService', '$cordovaGeolocation', '$ionicPopup', function ($scope, $stateParams, dataFactory, $cordovaGeolocation, $ionicPopup) {
    $scope.userPosition = {
      lat: "21.012529248181444",
      lgt: "105.52563034439083"
    };

    $scope.statuslist = [];

    getDetailFromServer();

    getListStatusFromServer();

    function getListStatusFromServer() {
      var urlBase = 'http://localhost:3000/api/status';
      dataFactory.getDataServer(urlBase)
        .success(function (rs) {
          $scope.statuslist = rs;
        })
        .error(function (error) {
          console.log('Unable to load order status list data: ' + error);
        });
    }

    function getDetailFromServer() {
      var urlBase = 'http://localhost:3000/api/detail/' + $stateParams.orderId;
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
          rebuildMap(points,center);

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

    function getCurrentPos(){
      var posOptions = {timeout: 1000, enableHighAccuracy: true};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $scope.userPosition.lat = position.coords.latitude;
          $scope.userPosition.lgt = position.coords.longitude;
          console.log(position);
          $ionicPopup.alert({
            title: "You're here",
            content: "Your postition: " + lat + " - " + lgt
          }).then(function (res) {
            console.log('Test Alert Box');
          });
          //var centerPoint = {lat: lat, lgt: lgt};
          //var points = [centerPoint];
          //rebuildMap(points, centerPoint);
        }, function (err) {
          // error
        });
    }

    function rebuildMap(points, centerPoint) {
      var myLatlng = new google.maps.LatLng(centerPoint.lat, centerPoint.lgt),
        mapOptions = {
          zoom: 10,
          center: myLatlng
          //mapTypeId: google.maps.MapTypeId.SATELLITE
        },
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
      points.map(function (point) {
        console.log(point);
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
  }]);
