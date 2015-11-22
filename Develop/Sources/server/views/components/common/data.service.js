/**
 * Created by Kaka Hoang Huy on 10/18/2015.
 */

angular.module('app').factory('dataService', ['$http', function ($http) {

  var dataFactory = {};

  dataFactory.getDataServer = function (urlBase, params) {
    // console.log('dataFactory:10', urlBase, params);
    return $http.get(urlBase, {
      dataType: "json",
      headers: {
        "Content-Type": "application/json"
      },
      params: params
    });
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

  return dataFactory;
}]);
