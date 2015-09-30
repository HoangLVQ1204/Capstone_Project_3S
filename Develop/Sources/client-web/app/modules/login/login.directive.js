var controller = require('./login.controller');
var template   = require('./login.html');

module.exports = function() {
  return {
    template: template,
    controller: controller,
    controllerAs: 'login',
    restrict: 'E',
    replace: false,
    scope: {}
  };
};