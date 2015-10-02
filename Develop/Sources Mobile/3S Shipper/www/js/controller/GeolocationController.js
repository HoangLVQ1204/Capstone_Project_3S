var app = angular.module('exampleGeo', ['ngCordova']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
app.controller('GeoCtrl', function($scope, $cordovaGeolocation, $ionicLoading) {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });

    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        console.log("Object gMap: " + position);
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        var myLatlng = new google.maps.LatLng(lat, long);

        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;
        $ionicLoading.hide();
      }, function(err) {
        $ionicLoading.hide();
        console.log(err);
      })

  }


  //var posOptions = {timeout: 10000, enableHighAccuracy: false};
  //$cordovaGeolocation
  //  .getCurrentPosition(posOptions)
  //  .then(function (position) {
  //    var lat  = position.coords.latitude;
  //    var long = position.coords.longitude;
  //    var myLatlng = new google.maps.LatLng(lat, long);
  //    var mapOptions = {
  //      center: myLatlng,
  //      zoom: 16,
  //      mapTypeId: google.maps.MapTypeId.ROADMAP
  //    };
  //
  //    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  //    $scope.map = map;
  //  }, function(err) {
  //    // error
  //  });
  //var watchOptions = {
  //  frequency : 1000,
  //  timeout : 3000,
  //  enableHighAccuracy: false // may cause errors if true
  //};
  //
  //var watch = $cordovaGeolocation.watchPosition(watchOptions);
  //watch.then(
  //  null,
  //  function(err) {
  //    // error
  //  },
  //  function(position) {
  //    var lat  = position.coords.latitude
  //    var long = position.coords.longitude
  //  });
  //
  //
  //watch.clearWatch();
  //// OR
  //$cordovaGeolocation.clearWatch(watch)
  //  .then(function(result) {
  //    // success
  //  }, function (error) {
  //    // error
  //  });
});
