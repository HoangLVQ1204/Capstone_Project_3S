/**
 * Created by Hoang on 14/11/2015.
 */

var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getTotal = function(req, res, next) {
        var username = req.user.username;
        db.notification.getTotalNumberOfNotifications(username)
        .then(function(c) {
            res.status(200).json(c);
        });
    };

    var getTotalUnread = function(req, res, next) {
        var username = req.user.username;
        db.notification.getTotalUnreadNotifications(username)
        .then(function(c) {
            res.status(200).json(c);
        });
    };

    var get = function(req, res, next) {
        console.log('notificationManage GET', req.query);
        var username = req.user.username;
        var offset = parseInt(req.query.offset[0]);
        var limit = parseInt(req.query.limit[0]);
        db.notification.getNotifications(username, offset, limit)
        .then(function(items) {
            items = items.map(function(e) {
                var temp = e.toJSON();
                temp.type = temp.type.toLowerCase();
                return temp;
            });
            // console.log('items', items);
            res.status(200).json(items);
        });
    };

    var post = function(req, res, next) {
        console.log('notificationManage POST');
        var notification = req.body;
        notification.username = req.user.username;        
        db.notification.addNotification(notification)
        .then(function(data) {
            res.status(201).json(data.toJSON());
        });
    };

    var put = function(req, res, next) {
        console.log('notificationManage PUT');
        var notification_id = req.params.notification_id;
        var data = req.body;
        data.notification_id = notification_id;
        // console.log('put', data);
        db.notification.updateNotification(data)
        .then(function(data) {   
            res.status(200).json(data.length);
        });
    };

    return {
        getTotal: getTotal,
        getTotalUnread: getTotalUnread,
        get: get,
        post: post,
        put: put
    }
}