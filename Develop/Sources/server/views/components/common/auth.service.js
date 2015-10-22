/**
 * Created by hoanglvq on 10/20/15.
 */

angular.module('app')
    .factory('authService',function($http,$q){
        var tag = 'EHID';

        var saveToken = function(token){
            window.localStorage.setItem(tag,token);
        }

        var signIn = function(data){
            return $http({
                data,
                url: 'http://localhost:3000/auth/signin',
                method: 'POST'
            }).then(function(data){
                console.log("Token Return: "+data.data.token);
                saveToken(data.data.token);
            });
        }

        return {
            signIn : signIn
        };
    });

