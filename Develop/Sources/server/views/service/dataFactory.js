/**
 * Created by Kaka Hoang Huy on 10/19/2015.
 */

angular.module('app').factory('dataService', ['$http', function ($http) {

    var dataService = {};

    dataService.getDataServer = function (urlBase) {
        return $http.get(urlBase);
    };

    dataService.postDataServer = function (urlBase, data) {
        return $http.post(urlBase, data);
    };

    dataService.putDataServer = function (urlBase, data) {
        return $http.put(urlBase, data)
    };

    dataService.deleteDataServer = function (urlBase) {
        return $http.delete(urlBase);
    };

    return dataService;
}]);
