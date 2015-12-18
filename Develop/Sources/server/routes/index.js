/**
 * Created by hoanglvq on 10/16/15.
 */

var loginRoutes   = require('./loginRoutes');
var userRoutes    = require('./api/userRoutes');
var shipperRoutes = require('./api/shipperRoutes');
var orderRoutes = require('./api/orderRoutes');
var taskRoutes = require('./api/taskRoutes');
var issueRoutes = require('./api/issueRoutes');
var provinceRoutes = require('./api/provinceRoutes');
var notificationRoutes = require('./api/notificationRoutes');
var storeRoutes = require('./api/storeRoutes');
var reportRoutes = require('./api/reportRoutes');
module.exports = function (app) {
    loginRoutes(app);
    userRoutes(app);
    shipperRoutes(app);
    orderRoutes(app);
    storeRoutes(app);
    taskRoutes(app);
    issueRoutes(app);
    provinceRoutes(app);   
    notificationRoutes(app);
    reportRoutes(app);
}

