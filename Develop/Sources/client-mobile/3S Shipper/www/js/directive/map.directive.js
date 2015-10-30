/**
 * Created by Kaka Hoang Huy on 10/27/2015.
 */


app
  .directive('map', function () {
    return {
      controller: 'mapCtrl',
      templateUrl: 'templates/map.html',
      controllerAs: 'map',
      replace: true,
      restrict: 'E',
      scope: {
        shipperMarkers: '=',
        storeMarkers: '=',
        customerMarkers: '=',
        orders: '=',
        circleRadius: '='
      }
    }
  });
