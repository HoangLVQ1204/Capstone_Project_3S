/**
 * Created by Hoang on 14/11/2015.
 */

var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getTotal = function(username) {
        return db.notification.getTotalNumberOfNotifications(username);
    };

    function getTotalUnread(username) {
        return db.notification.getTotalUnreadNotifications(username);
    };

    var get = function(username, offset, limit) {        
        return db.notification.getNotifications(username, offset, limit)
        .then(function(items) {
            items = items.map(function(e) {
                var temp = e.toJSON();
                temp.type = temp.type.toLowerCase();
                return temp;
            });
            // console.log('items', items);
            return items;
        });
    };

    var post = function(notification) {
        // console.log('notificationManage POST');        
        if (!notification.username) 
            notification.username = req.user.username;        
        return db.notification.addNotification(notification)
        .then(function(data) {
            return data.toJSON();            
        });
    };

    var put = function(data, notification_id) {
        // console.log('notificationManage PUT');        
        data.notification_id = notification_id;
        // console.log('put', data);
        return db.notification.updateNotification(data)
        .then(function(data) {   
            return data.length;
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