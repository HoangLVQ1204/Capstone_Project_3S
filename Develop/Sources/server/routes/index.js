/**
 * Created by hoanglvq on 10/16/15.
 */

var loginRoutes   = require('./loginRoutes');
var userRoutes    = require('./api/userRoutes');
var shipperRoutes = require('./api/shipperRoutes');
var orderRoutes = require('./api/orderRoutes');
var ledgerRoutes = require('./api/ledgerRoutes');

var storeRoutes = require('./api/storeRoutes');
module.exports = function (app) {
    loginRoutes(app);
    userRoutes(app);
    shipperRoutes(app);
    orderRoutes(app);
    storeRoutes(app);
    ledgerRoutes(app);
}

