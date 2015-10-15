var controller = require('./<%= name %>.controller');
var template   = require('./<%= name %>.html');

module.exports = function() {
  return {
    template: template,
    controller: controller,
    controllerAs: '<%= name %>',
    restrict: 'E',
    replace: false,
    scope: {}
  };
};