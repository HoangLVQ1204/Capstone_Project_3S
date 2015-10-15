var controller = require('./storeDashboard.controller');
var template   = require('./storeDashboard.html');

module.exports = function() {
  return {
    template: template,
    controller: controller,
    controllerAs: 'storeDashboard',
    restrict: 'E',
    replace: false,
    scope: {}
  };
};