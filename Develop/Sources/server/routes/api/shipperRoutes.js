/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function(app) {

    var shipperCtrl = require('./../../manages/shipperController')(app);

    app.get('/tasks', shipperCtrl.get);

}