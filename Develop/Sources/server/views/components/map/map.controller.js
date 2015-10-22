/**
 * Created by hoanglvq on 10/22/15.
 */
/**
 * Created by hoanglvq on 10/19/15.
 */

function mapController($scope,uiGmapGoogleMapApi,uiGmapIsReady){

    uiGmapGoogleMapApi.then(function(maps){

        /*
            Khởi tạo các biểu tượng:
            + Địa điểm đi
            + Địa điểm đến

         */
        $scope.destinationIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=D|FF0000|000000';
        $scope.sourceIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=S|FFFF00|000000';
        $scope.disabledIcon = 'http://chart.apis.google.com/chart?' +
            'chst=d_map_pin_letter&chld=x|3366FF';

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
        infoWindow.setContent("Em đây nè!");

        /*
            Khởi tạo giá trị config ban đầu cho map
         */
        $scope.map = {
            center: $scope.center,
            zoom: 12,
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

        for(var i = 0; i < $scope.markers.length; i++){
            $scope.markers[i].icon = $scope.destinationIcon;
            $scope.markers[i].disabled = false;
        }

        //$scope.markersClone = _.cloneDeep($scope.markers);
        //$scope.fromMarker   = "";
        //$scope.toMarker     = "";
        //
        //$scope.removeMarker = function(index, marker){
        //    $scope.markersClone.splice(index,1);
        //}

    });

    //$scope.$watch('$viewContentLoaded', function(event) {
    //    caplet();
    //});
}

mapController.$inject = ['$scope','uiGmapGoogleMapApi','uiGmapIsReady'];
angular.module('app').controller('mapController',mapController);


