/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */
  app.controller('DetailCtrl', ['$scope', '$stateParams', 'dataService', '$cordovaGeolocation', '$ionicPopup', '$ionicModal', '$ionicPopover', function ($scope, $stateParams, dataFactory, $cordovaGeolocation, $ionicPopup, $ionicModal, $ionicPopover) {
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
          //$ionicPopup.alert({
          //  title: "Successfully!",
          //  content: "You're order has been moved to next step! Continue your work! :D"
          //}).then(function (rs) {
          //  //Reload
          //  getDetailFromServer();
          //});
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
          }, 3000);
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
      $scope.popover.show($event);
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
  }]
);
