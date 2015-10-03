/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
var app = angular.module('device', ['ngCordova']);

app.controller('DeviceCtrl', function ($ionicPlatform, $scope, $cordovaDevice) {
  $ionicPlatform.ready(function () {
    $scope.$apply(function () {
      // sometimes binding does not work! :/
      // getting device infor from $cordovaDevice
      var device = $cordovaDevice.getDevice();
      $scope.manufacturer = device.manufacturer;
      $scope.model = device.model;
      $scope.platform = device.platform;
      $scope.uuid = device.uuid;
    })
  })
})
