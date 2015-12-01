/**
 * Created by Kaka Hoang Huy on 10/18/2015.
 */

app.factory('dataService', ['$http', '$state', '$ionicPopup', '$rootScope', 'socketService', function ($http, $state, $ionicPopup, $rootScope, socketService) {

  var dataFactory = {};

  function errorHandle(err) {

    if (err.status == 401) {
      var tag = 'EHID';
      window.localStorage.removeItem(tag);
      if($rootScope.isLoggedOut == false){
        $ionicPopup.alert({
          title: 'Information',
          template: err.data
        }).then(function(res){
          $rootScope.isLoggedOut = false;
          socketService.disconnect();
          location.href = '#/sign-in';
        });
      }
      $rootScope.isLoggedOut = true;
    }

    throw err;
  }

  dataFactory.getDataServer = function (urlBase) {
    return $http.get(urlBase).then(function (rs) {
      return rs;
    }, function (err) {
      errorHandle(err);
    })
  };

  dataFactory.postDataServer = function (urlBase, data) {
    return $http.post(urlBase, data).then(function (rs) {
      return rs;
    }, function (err) {
      errorHandle(err);
    })
  };

  dataFactory.putDataServer = function (urlBase, data) {
    return $http.put(urlBase, data).then(function (rs) {
      return rs;
    }, function (err) {
      errorHandle(err);
    })
  };

  dataFactory.deleteDataServer = function (urlBase) {
    return $http.delete(urlBase).then(function (rs) {
      return rs;
    }, function (err) {
      errorHandle(err);
    })
  };

  return dataFactory;
}]);
