/**
 * Created by hoanglvq on 10/16/15.
 */
//var loginRoutes = require('./loginRoutes');

var userRoutes = require('./api/userRoutes');
module.exports = function (app) {
    userRoutes(app);
}

