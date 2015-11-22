/**
 * Created by Kaka Hoang Huy on 10/18/2015.
 */

angular.module('app').factory('dataService', ['$http', function ($http, $state) {

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
        $.notific8('This account is logged in at another place!! ',
            {
                life: 5000,
                horizontalEdge: "bottom",
                theme: "danger",
                heading: " UNAUTHORIZED :); "
            }
        );
        $state.go("login");
    }

    return dataFactory;
}]);
