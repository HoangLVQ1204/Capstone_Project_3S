/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/orderManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.param('orderid', controller.params);

    app.route('/api/getAllOrder')
        .get(controller.getOrderList);

    app.route('/api/getTodayTotal')
        .get(controller.getTodayTotal);

    app.route('/orders')
        .get(checkAll,function(req,res,next){
                var storeId = req.user.stores[0].storeid;
                controller.getAllOrder(storeId).then(function(data){
                    res.status(200).json(data);
                })
                .catch(function(er){
                    next(err);
                })
            })
        .post(checkAll,function(req,res,next){
            var data = req.body;
            controller.postOneOrder(data).then(function(data){
                res.status(200).json(data);
            })
            .catch(function(er){
                    next(err);
            })
        });

    app.route('/orders/updateExpressOrder')
        .put(controller.updateExpressOrder)    
        
    app.route('/orders/:orderid')
        .get(checkAll, function(req,res,next){
             res.status(200).json(req.orderRs);
        })
        .put(checkAll,function(req,res,next) {
            controller.updateOrder(req).then(function(){
                res.status(200).json("Update successfully!");
            })
            .catch(function(er){
                    next(err);
            })
        })

        .delete(checkAll,function(req,res,next){
            var orderId = req.orderRs.toJSON().orderid;
            controller.deleteOrder(orderId).then(function(data){
                    res.status(200).json("DELETED!");
            })
            .catch(function(err){
                next(err);
            })
        });

    app.route('/store/orders/cancel').post(checkAll,function(req, res, next) {
        var ownerStoreUser = req.user.username;
        var storeID = req.user.stores[0].storeid;
        var orderID = req.body.orderid;
        controller.cancelOrder(ownerStoreUser, storeID, orderID).then(function(data) {
            res.status(200).json('OK');
        })
        .catch(function(err) {
            next(err);
        })
    });

     app.route('/api/store/getAllOrder')
        .get(checkAll,function(req,res,next){
            var storeId = req.user.stores[0].storeid;
            controller.storeGetOrderList(storeId).then(function(data){
                res.status(200).json(data);
            }) 
            .catch(function(err){
                next(err);
            })  
        });

    app.route('/api/admin/order/countOrder')
        .get(checkAll, controller.countOrder);



};