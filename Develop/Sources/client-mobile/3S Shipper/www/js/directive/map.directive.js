/**
 * Created by Nguyen Van Quyen on 10/27/2015.
 */
app.directive('map', function () {
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
})
