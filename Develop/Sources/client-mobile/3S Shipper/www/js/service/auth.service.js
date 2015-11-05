/**
 * Created by Nguyen Van Quyen on 10/27/2015.
 */

app.factory('authService', function ($http, $q, jwtHelper) {
  var tag = 'EHID';

  var saveToken = function (token) {
    window.localStorage.setItem(tag, token);
  }

  var signIn = function (data) {
    return $http({
      data: data,
      url: config.hostServer + 'auth/signin',
      method: 'POST'
    }).then(function (data) {
      saveToken(data.data.token);
    });
  }

  var isLogged = function () {
    var localEHID = window.localStorage.getItem(tag);
    if (window.localStorage.getItem(tag) != null) {
      return true;
    } else {
      return false;
    }
  }

  var isRightRole = function (role) {
    var token = jwtHelper.decodeToken(localStorage.getItem('EHID'));
    return role == token.userrole;
  }

  var signOut = function () {
    window.localStorage.removeItem(tag);
  }

  var getCurrentInfoUser = function () {
    return jwtHelper.decodeToken(localStorage.getItem('EHID'));
  };

  return {
    signIn: signIn,
    isLogged: isLogged,
    isRightRole: isRightRole,
    signOut: signOut,
    getCurrentInfoUser: getCurrentInfoUser
  };
});
