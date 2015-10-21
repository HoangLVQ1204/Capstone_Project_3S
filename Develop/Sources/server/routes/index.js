/**
 * Created by hoanglvq on 10/16/15.
 */

var loginRoutes   = require('./loginRoutes');
var userRoutes    = require('./api/userRoutes');
var shipperRoutes = require('./api/shipperRoutes');

module.exports = function (app) {
    loginRoutes(app);
    userRoutes(app);
    shipperRoutes(app);
}

