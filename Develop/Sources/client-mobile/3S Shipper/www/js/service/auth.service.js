/**
 * Created by Nguyen Van Quyen on 10/27/2015.
 */

app.factory('authService',function($http,$q,jwtHelper){
    var tag = 'EHID';

    var saveToken = function(token){
      window.localStorage.setItem(tag,token);
    }

    var signIn = function(data){
      return $http({
        data: data,
        url: config.hostServer + 'auth/signin',
        method: 'POST'
      }).then(function(data){
        saveToken(data.data.token);
      });
    }

    var isLogged = function(){
      if(window.localStorage.getItem(tag) || window.localStorage.getItem(tag) !== "undefined"){
        return true;
      }else{
        return false;
      }
    }

    var isRightRole = function(role){
      var token = jwtHelper.decodeToken(localStorage.getItem('EHID'));
      return role == token.userrole;
    }

    var signOut = function(){
      window.localStorage.removeItem(tag);
    }

    return {
      signIn : signIn,
      isLogged: isLogged,
      isRightRole: isRightRole,
      signOut: signOut
    };
  });
