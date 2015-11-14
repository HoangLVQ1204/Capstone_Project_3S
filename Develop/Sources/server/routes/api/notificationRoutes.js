/**
 * Created by Hoang on 14/11/2015.
 */

module.exports = function (app) {
    var controller = require('./../../manages/notificationManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.route('/api/notifications/total')
        .get(checkAll, controller.getTotal);

    app.route('/api/notifications')
        .get(checkAll, controller.get)
        .post(checkAll, controller.post);

    app.route('/api/notifications/:notification_id')
    	.put(checkAll, controller.put);          
};