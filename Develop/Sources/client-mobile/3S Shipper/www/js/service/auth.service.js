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
        url: 'http://localhost:3000/auth/signin',
        method: 'POST'
      }).then(function(data){
        saveToken(data.data.token);
      });
    }

    //var isLogged = function(){
    //  if(window.localStorage.getItem(tag)){
    //    return true;
    //  }else{
    //    return false;
    //  }
    //}

    var isRightRole = function(role){
      var token = jwtHelper.decodeToken(localStorage.getItem('EHID'));
      return role == token.userrole;
    }

    //var currentRole = function(){
    //  var token = jwtHelper.decodeToken(localStorage.getItem('EHID'));
    //  return token.userrole;
    //}

    return {
      signIn : signIn,
      //isLogged: isLogged,
      isRightRole: isRightRole
    };
  });
