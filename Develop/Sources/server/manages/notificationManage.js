/**
 * Created by Hoang on 14/11/2015.
 */

var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    function getTotal(username) {
        return db.notification.getTotalNumberOfNotifications(username);
    };

    function getTotalUnread(username) {
        return db.notification.getTotalUnreadNotifications(username);
    };

    function getPageNotifications(username, offset, limit) {        
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

    function addNotification(notification) {
        // console.log('notificationManage POST');        
        if (!notification.username) 
            notification.username = req.user.username;        
        return db.notification.addNotification(notification)
        .then(function(data) {
            return data.toJSON();            
        });
    };

    function updateNotification(data, notification_id) {
        // console.log('notificationManage PUT');        
        data.notification_id = notification_id;
        // console.log('put', data);
        return db.notification.updateNotification(data)
        .then(function(data) {   
            return data.length;
        });
    };

    function postFromSever(notification) {
        return db.notification.addNotification(notification);
    };

    return {
        getTotal: getTotal,
        getTotalUnread: getTotalUnread,
        getPageNotifications: getPageNotifications,
        addNotification: addNotification,
        updateNotification: updateNotification,
        postFromSever: postFromSever
    }
}