/**
 * Created by Kaka Hoang Huy on 10/18/2015.
 */

angular.module('app').factory('dataService', ['$http','$state',function ($http,$state) {

    var dataFactory = {};

    function errorHandle(err){

        if(err.status == 401){

            var tag = 'EHID';
            window.localStorage.removeItem(tag);
            location.href = '#/auth/login';

        }

        throw err;
    }

    dataFactory.getDataServer = function (urlBase) {
        return $http.get(urlBase).then(function(rs){
            return rs;
        },function(err){
            errorHandle(err);
        })
    };

    dataFactory.postDataServer = function (urlBase, data) {
        return $http.post(urlBase, data).then(function(rs){
            return rs;
        },function(err){
            errorHandle(err);
        })
    };

    dataFactory.putDataServer = function (urlBase, data) {
        return $http.put(urlBase, data).then(function(rs){
            return rs;
        },function(err){
            errorHandle(err);
        })
    };

    dataFactory.deleteDataServer = function (urlBase) {
        return $http.delete(urlBase).then(function(rs){
            return rs;
        },function(err){
            errorHandle(err);
        })
    };

    return dataFactory;
}]);
