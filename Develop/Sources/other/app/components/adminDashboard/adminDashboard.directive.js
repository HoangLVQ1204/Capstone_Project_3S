var controller = require('./adminDashboard.controller');
var template   = require('./adminDashboard.html');

module.exports = function() {
  return {
    template: template,
    controller: controller,
    controllerAs: 'adminDashboard',
    restrict: 'E',
    replace: false,
    scope: {}
  };
};