var controller = require('./guest.controller');
var template   = require('./guest.html');

module.exports = function() {
  return {
    template: template,
    controller: controller,
    controllerAs: 'guest',
    restrict: 'E',
    replace: false,
    scope: {}
  };
};