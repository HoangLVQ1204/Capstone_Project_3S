/**
 * Created by hoanglvq on 10/13/15.
 */

module.exports = function (app) {

    var shipperCtrl = require('./../../manages/shipperManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.get('/api/tasks', checkAll, shipperCtrl.getTasks);

    app.get('/api/shipper/getNewShipperID', checkAll,function(req,res,next){
            shipperCtrl.createShipperID().then(function(data){
                res.status(200).json(data);
            })
            .catch(function(err){
                next(err);
            })
    });

    app.put('/api/shipper/updateTaskForShipper', checkAll,function(req,res,next){
            var shipperList = req.body;
            shipperCtrl.updateTaskForShipper(shipperList).then(function(data){
                res.status(201).json(data);
            })
            .catch(function(err){
                next(err);
            })
    });

    app.get('/api/shipper/getAllShipper', checkAll,function(req,res,next){
            shipperCtrl.getAllShipper().then(function(data){
                res.status(200).json(data);
            })
            .catch(function(err){
                next(err);
            })
    });

    app.get('/api/shipper/getTaskBeIssuePending', checkAll, shipperCtrl.getTaskBeIssuePending);

    app.get('/api/shipper/getAllShipperWithTask', checkAll,function(req,res,next){
            shipperCtrl.getAllShipperWithTask().then(function(data){
                res.status(200).json(data);
            })
            .catch(function(err){
                next(err);
            })
    });

    app.get('/api/shipper/getAllShipperWithTaskForProcessing/:shipperid', shipperCtrl.getAllShipperWithTaskForProcessing);

    app.get('/api/shipper/getAllOrderToAssignTask', checkAll,function(req,res,next){
            shipperCtrl.getAllOrderToAssignTask().then(function(data){
                res.status(200).json(data);
            })
            .catch(function(err){
                next(err);
            })
    });

    app.post('/api/issue', checkAll, shipperCtrl.createIssuePending);

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

    app.route('/api/shipper/test-socket2')
        .get(shipperCtrl.testSk2);

    app.route('/api/shipper/test-socket3')
        .get(shipperCtrl.testSk3);


}