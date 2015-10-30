/**
 * Created by hoanglvq on 10/22/15.
 */

app
    .directive('map',function(){
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
