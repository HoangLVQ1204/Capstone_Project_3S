/**
 * Created by hoanglvq on 10/20/15.
 */

angular.module('app')
    .factory('authService',function($http,$q,jwtHelper,config,dataService,$state){
        var tag = 'EHID';

        var saveToken = function(token){
            window.localStorage.setItem(tag,token);
        }

        var signIn = function(data){
            return $http({
                data,
                url: config.baseURI + '/auth/signin',
                method: 'POST'
            }).then(function(data){
                saveToken(data.data.token);
            });
        }

        var signOut = function(){
            window.localStorage.removeItem(tag);
            $state.go("login");
        }

        var isLogged = function(){
            if(window.localStorage.getItem(tag)){
                return true;
            }else{
                return false;
            }
        }

        var isRightRole = function(role){
            var token = jwtHelper.decodeToken(localStorage.getItem('EHID'));
            return role == token.userrole;
        }

        var currentRole = function(){
            var token = jwtHelper.decodeToken(localStorage.getItem('EHID'));
            return token.userrole;
        }

        var getCurrentInfoUser = function(){
            var currentUser = jwtHelper.decodeToken(localStorage.getItem('EHID'));
            return currentUser;
        }

        var getProfileUser = function(){
            var urlBase = config.baseURI + '/user/profile/' + getCurrentInfoUser().username;
            return dataService.getDataServer(urlBase);
        }

        return {
            signIn : signIn,
            signOut: signOut,
            isLogged: isLogged,
            isRightRole: isRightRole,
            getCurrentInfoUser: getCurrentInfoUser,
            getProfileUser: getProfileUser
        };
    });

