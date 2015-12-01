/**
 * Created by Hoang on 14/11/2015.
 */

module.exports = function (app) {
    var controller = require('./../../manages/notificationManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.route('/api/notifications/total')
        .get(checkAll, function(req, res, next) {
            var username = req.user.username;
            controller.getTotal(username)
            .then(function(c) {
                res.status(200).json(c);
            });
        });

    app.route('/api/notifications/unread')
        .get(checkAll, function(req, res, next) {
            var username = req.user.username;
            controller.getTotalUnread(username)
            .then(function(c) {
                res.status(200).json(c);
            })
            .catch(function(err) {
                next(err);
            })
        });

    app.route('/api/notifications')
        .get(checkAll, function(req, res, next) {
            var username = req.user.username;
            var offset = parseInt(req.query.offset);
            var limit = parseInt(req.query.limit);
            controller.get(username, offset, limit)
            .then(function(items) {
                res.status(200).json(items);
            });
        })
        .post(checkAll, function(req, res, next) {
            var notification = req.body;
            controller.post(notification)
            .then(function(data) {
                res.status(201).json(data);
            });
        });

    app.route('/api/notifications/:notification_id')
    	.put(checkAll, function(req, res, next) {
            var notification_id = req.params.notification_id;
            var data = req.body;            
            controller.put(data, notification_id)
            .then(function(data) {
                res.status(200).json(data);
            })
        });          
};