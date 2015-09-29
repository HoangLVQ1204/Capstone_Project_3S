/**
 * Created by hoanglvq on 9/22/15.
 */
var controller = require('./admin.controller');
console.log("controller"+controller);
var template   = require('./admin.html');
console.log("template"+template);

console.log('admin.directive');

module.exports = function() {
    return {
        template: template,
        controller: controller,
        controllerAs: 'admin',
        restrict: 'E',
        replace: false,
        scope: {}
    };
};


