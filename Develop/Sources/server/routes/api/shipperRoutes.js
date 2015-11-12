/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperController')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.get('/api/tasks', checkAll, shipperCtrl.getTask);

    app.post('/api/shipper/updateTaskForShipper', shipperCtrl.updateTaskForShipper);

    app.get('/api/shipper/getAllShipper', shipperCtrl.getAllShipper);

    app.get('/api/shipper/getTaskBeIssuePending', checkAll,  shipperCtrl.getTaskBeIssuePending);

    app.get('/api/shipper/getAllShipperWithTask', shipperCtrl.getAllShipperWithTask);

    app.get('/api/shipper/getAllOrderToAssignTask', shipperCtrl.getAllOrderToAssignTask);

    app.post('/api/issue', shipperCtrl.createIssue);

    app.put('/api/changeIsPendingOrder', checkAll, shipperCtrl.changeIsPending);

    app.get('/api/getAllTaskCancel', checkAll,  shipperCtrl.getAllTaskCancel);

    app.route('/api/shipper/history')
        .get(checkAll, shipperCtrl.getHistory);

    app.route('/api/shipper/detail/:orderid')
        .get(shipperCtrl.getDetail);

    app.param('orderid', shipperCtrl.paramOrderId);

    app.route('/api/shipper/statuslist')
        .get(shipperCtrl.getExpressStatusList);

    app.route('/api/shipper/nextstep')
        .put(checkAll, shipperCtrl.nextStep);

    app.route('/api/shipper/mapdata/:order')
        .get(shipperCtrl.getMapData);

    app.param('order', shipperCtrl.paramMapdata);

    app.route('/api/shipper/status')
        .get(checkAll, shipperCtrl.getShipperStatus);

    app.route('/api/shipper/countTasks')
        .get(checkAll, shipperCtrl.countTaskOfShipper);

    app.route('/api/shipper/change-status')
        .put(checkAll, shipperCtrl.changeShipperStatus);

    app.route('/api/shipper/test-socket')
        .get(shipperCtrl.testSk);

}