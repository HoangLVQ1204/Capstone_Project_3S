/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperController')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.get('/api/tasks', checkAll, shipperCtrl.getTask);

    app.post('/api/issue', shipperCtrl.createIssue);

    app.route('/api/history')
        .get(shipperCtrl.getHistory);


    app.route('/api/detail/:orderid')
        .get(shipperCtrl.getDetail);

    app.param('orderid', shipperCtrl.paramOrderId);

    app.route('/api/statuslist')
        .get(shipperCtrl.getExpressStatusList);

    app.route('/api/nextstep')
        .put(shipperCtrl.nextStep);

}