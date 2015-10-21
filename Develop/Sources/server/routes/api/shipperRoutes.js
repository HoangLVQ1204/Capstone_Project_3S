/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperController')(app);

    app.get('/api/tasks', shipperCtrl.getTask);

    app.route('/api/history')
        .get(shipperCtrl.getHistory);


    app.route('/api/detail/:orderid')
        .get(shipperCtrl.getDetail);

    app.param('orderid', shipperCtrl.paramOrderId);

}