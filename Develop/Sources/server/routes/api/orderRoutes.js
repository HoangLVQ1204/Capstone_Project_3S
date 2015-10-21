/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/orderManage')(app);

    app.param('order_id', controller.params);

    app.route('/orders')
        .get(controller.getAllOrder)
        .post(controller.postOne);


    app.route('/orders/:order_id')
        .get(controller.getOne)
        .put(controller.put)
}