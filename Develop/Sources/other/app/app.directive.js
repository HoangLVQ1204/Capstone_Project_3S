var controller = require('./app.controller');
var template = require('./app.html');

console.log(controller);
console.log(template);
module.exports = function() {
    return {
        controller: controller,
        template: template,
        controllerAs: 'app',
        scope: {},
        replace: true,
        restrict: 'E'
    }
};
/**
 * Created by hoanglvq on 9/22/15.
 */
