/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/orderManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.param('order_id', controller.params);

    app.route('/api/getAllOrder')
        .get(controller.getOrderList);

    app.route('/api/getTodayTotal')
        .get(controller.getTodayTotal);

    app.route('/orders')
        .get(checkAll,controller.getAllOrder)
        .post(controller.postOne);


    app.route('/orders/:order_id')
        .get(controller.getOne)
        .put(controller.put)
        .delete(controller.deleteOrder);

    app.route('/orders/putdraff')
        .post(controller.putDraff);

    app.route('/orders/cancel')
        .put(controller.cancelOrder);

};