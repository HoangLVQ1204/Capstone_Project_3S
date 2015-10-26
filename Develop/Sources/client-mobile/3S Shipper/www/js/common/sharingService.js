/**
 * Created by Nguyen Van Quyen on 10/23/2015.
 * Sharing $scope between controllers with angularjs
 */

app.factory('mySharedService', function($rootScope) {
  var sharedService = {};

  sharedService.message = '';
  sharedService.prepForBroadcast = function(msg) {
    this.message = msg;
    this.broadcastItem();
  };

  sharedService.broadcastItem = function() {
    $rootScope.$broadcast('handleBroadcast');
  };

  return sharedService;
});


