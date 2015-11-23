/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.get('/api/tasks', checkAll, shipperCtrl.getTask);

    app.get('/api/shipper/getNewShipperID', shipperCtrl.createShipperID);

    app.post('/api/shipper/updateTaskForShipper', shipperCtrl.updateTaskForShipper);

    app.get('/api/shipper/getAllShipper', shipperCtrl.getAllShipper);

    app.get('/api/shipper/getTaskBeIssuePending', checkAll, shipperCtrl.getTaskBeIssuePending);

    app.get('/api/shipper/getAllShipperWithTask', shipperCtrl.getAllShipperWithTask);

    app.get('/api/shipper/getAllShipperWithTaskForProcessing', shipperCtrl.getAllShipperWithTaskForProcessing);

    app.get('/api/shipper/getAllOrderToAssignTask', shipperCtrl.getAllOrderToAssignTask);

    app.post('/api/issue', checkAll, shipperCtrl.createIssue);

    app.put('/api/changeIsPendingOrder', checkAll, shipperCtrl.changeIsPending);

    app.route('/api/shipper/history')
        .get(checkAll, shipperCtrl.getHistory);

    app.route('/api/shipper/detail')
        .get(checkAll, shipperCtrl.getDetail);

    app.param('detailtaskid', shipperCtrl.paramOrderId);

    app.route('/api/shipper/statuslist')
        .get(shipperCtrl.getOrderStatusList);

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