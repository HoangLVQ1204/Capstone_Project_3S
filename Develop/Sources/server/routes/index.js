/**
 * Created by hoanglvq on 10/16/15.
 */
//var loginRoutes = require('./loginRoutes');

var userRoutes = require('./api/userRoutes');
var shipperRoutes = require('./api/shipperRoutes');
var storeRoutes = require('./api/storeRoutes');
module.exports = function (app) {
    userRoutes(app);
    shipperRoutes(app);
    storeRoutes(app);
}

