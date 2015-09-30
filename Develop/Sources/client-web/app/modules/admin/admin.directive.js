/**
 * Created by hoanglvq on 9/22/15.
 */
var controller = require('./admin.controller');
var template   = require('./admin.html');

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


