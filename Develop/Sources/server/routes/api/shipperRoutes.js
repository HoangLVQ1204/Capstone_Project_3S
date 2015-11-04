/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperController')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    //app.get('/api/tasks', checkAll, shipperCtrl.getTask);
    app.get('/api/tasks', shipperCtrl.getTask);

    app.get('/api/shipper/getAllShipper', shipperCtrl.getAllShipper);

    app.get('/api/shipper/getTaskBeIssuePending', shipperCtrl.getTaskBeIssuePending);

    app.get('/api/shipper/getAllShipperWithTask', shipperCtrl.getAllShipperWithTask);

    app.get('/api/shipper/getAllOrderToAssignTask', shipperCtrl.getAllOrderToAssignTask);

    app.post('/api/issue', shipperCtrl.createIssue);

    app.put('/api/changeIsPendingOrder', shipperCtrl.changeIsPending);

    app.get('/api/getAllTaskCancel', shipperCtrl.getAllTaskCancel);

    app.route('/api/history')
        .get(shipperCtrl.getHistory);

    app.route('/api/detail/:orderid')
        .get(shipperCtrl.getDetail);

    app.param('orderid', shipperCtrl.paramOrderId);

    app.route('/api/statuslist')
        .get(shipperCtrl.getExpressStatusList);

    app.route('/api/nextstep')
        .put(shipperCtrl.nextStep);

    app.route('/api/mapdata/:order')
        .get(shipperCtrl.getMapData);

    app.param('order', shipperCtrl.paramMapdata);

}