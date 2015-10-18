/**
 * Created by Kaka Hoang Huy on 10/18/2015.
 */

app.factory('dataFactory', ['$http', function ($http) {

  var dataFactory = {};

  dataFactory.getDataServer = function (urlBase, data) {
    return $http.get(urlBase, data);
  };

  dataFactory.postDataServer = function (urlBase, data) {
    return $http.post(urlBase, data);
  };

  dataFactory.putDataServer = function (urlBase, data) {
    return $http.put(urlBase, data)
  };

  dataFactory.deleteDataServer = function (urlBase, data) {
    return $http.delete(urlBase + '/' + id);
  };

  return dataFactory;
}]);
