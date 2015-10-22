/**
 * Created by hoanglvq on 10/22/15.
 */

angular.module('app')
    .directive('map',function(){
        return {
            controller: 'mapController',
            templateUrl: '/components/map/map.html',
            controllerAs: 'map',
            replace: true,
            restrict: 'E',
            scope: {

                markers: '=',
                circleRadius: '=',
                center: '='

            },
            link: function($scope){

                $scope.markers = $scope.markers || [];
                $scope.markersControl = {};

                var initCenter = {
                    latitude: 21.0126119,
                    longitude: 105.5257474
                }

                $scope.center = $scope.center || initCenter;
            }
        }
    });
