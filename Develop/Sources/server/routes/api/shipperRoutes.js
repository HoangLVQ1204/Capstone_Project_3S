/**
 * Created by hoanglvq on 10/13/15.
 */
var _ = require('lodash');

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.get('/api/tasks', checkAll, shipperCtrl.getTasks);

    app.get('/api/shipper/getNewShipperID', shipperCtrl.createShipperID);

    app.put('/api/shipper/updateTaskForShipper', shipperCtrl.updateTaskForShipper);

    app.get('/api/shipper/getAllShipper', shipperCtrl.getAllShipper);

    app.get('/api/shipper/getTaskBeIssuePending', checkAll, shipperCtrl.getTaskBeIssuePending);

    app.get('/api/shipper/getAllShipperWithTask', shipperCtrl.getAllShipperWithTask);

    app.get('/api/shipper/getAllShipperWithTaskForProcessing/:shipperid', shipperCtrl.getAllShipperWithTaskForProcessing);

    app.get('/api/shipper/getAllOrderToAssignTask', shipperCtrl.getAllOrderToAssignTask);

    app.post('/api/issue', checkAll, shipperCtrl.createIssuePending);

    app.put('/api/changeIsPendingOrder', checkAll, shipperCtrl.changeIsPending);

    app.route('/api/shipper/history')
        .get(checkAll, function (req, res, next) {
            var shipper = _.cloneDeep(req.user);
            var shipperid = shipper.username;
            var page = _.cloneDeep(req.query.page);
            page = page ? page : 0;
            shipperCtrl.getHistory(shipperid, page).then(function(history){
                return res.status(200).json(history);
            })
        });

    app.route('/api/shipper/detail')
        .get(checkAll, function (req, res, next) {
            var detailtaskid = req.query.taskid;
            var shipper = _.cloneDeep(req.user);
            var shipperid = shipper.username;
            shipperCtrl.getDetail(shipperid, detailtaskid).then(function(rs){
                return res.status(200).json(rs);
            })
        });

    app.param('detailtaskid', shipperCtrl.paramOrderId);

    app.route('/api/shipper/statuslist')
        .get(shipperCtrl.getOrderStatusList);

    app.route('/api/shipper/nextstep')
        .put(checkAll, function (req, res, next) {
            var shipper = _.cloneDeep(req.user);
            var shipperid = shipper.username;
            var data = _.cloneDeep(req.body);
            shipperCtrl.nextStep(shipperid, data).then(function(rs){
                return res.status(200).json(rs);
            })
        });

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

    app.route('/api/shipper/test-socket2')
        .get(shipperCtrl.testSk2);

    app.route('/api/shipper/test-socket3')
        .get(shipperCtrl.testSk3);


}