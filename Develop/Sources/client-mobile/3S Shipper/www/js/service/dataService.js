/**
 * Created by Kaka Hoang Huy on 10/18/2015.
 */

app.factory('dataService', ['$http', '$state', function ($http, $state) {

  var dataFactory = {};

  dataFactory.getDataServer = function (urlBase) {
    return $http.get(urlBase);
  };

  dataFactory.postDataServer = function (urlBase, data) {
    return $http.post(urlBase, data);
  };

  dataFactory.putDataServer = function (urlBase, data) {
    return $http.put(urlBase, data)
  };

  dataFactory.deleteDataServer = function (urlBase) {
    return $http.delete(urlBase);
  };

  var tag = 'EHID'
  dataFactory.signOutWhenTokenFail = function () {
    window.localStorage.removeItem(tag);
    $state.go("sign-in");
  }

  return dataFactory;
}]);
