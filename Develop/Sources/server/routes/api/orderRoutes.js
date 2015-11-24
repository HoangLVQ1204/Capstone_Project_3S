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
        .get(checkAll,controller.getAllOrder)
        .post(controller.postOne);

    app.route('/orders/updateExpressOrder')
        .put(controller.updateExpressOrder)    
        
    app.route('/orders/:orderid')
        .get(controller.getOne)
        .put(checkAll,controller.updateOrder)
        .delete(checkAll,controller.deleteOrder);

    app.route('/orders/putdraff')
        .post(controller.putDraff);

    app.route('/store/orders/cancel')
        .post(checkAll,controller.cancelOrder);

    app.route('/api/store/deleteGoods')
        .delete(checkAll, controller.deleteGoods);

    app.route('/api/store/addGoods')
        .post(controller.addGoods);

    app.route('/api/store/goods')
        .put(checkAll, controller.updateGoods);

    app.route('/api/store/getAllOrder')
        .get(checkAll, controller.storeGetOrderList);

    app.route('/api/admin/order/countOrder')
        .get(checkAll, controller.countOrder);



};