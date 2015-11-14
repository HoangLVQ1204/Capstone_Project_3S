/**
 * Created by Cao Khanh on 13/11/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/provinceManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    // app.param('order_id', controller.params);

    app.route('/api/getProvince')
        .get(controller.getAllProvince);

};