/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');

    var get = function(req,res,next) {
        var shipperid = 'hoang';
        var taskdate = '2015-02-09';
        var Task = db.task;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        //get all task of shipper
        Order.hasMany(Task, {
            foreignKey: 'orderid',
            constraints: false
        });
        //get status name of order
        Order.belongsTo(OrderStatus, {
            foreignKey: 'statusid',
            constraints: false
        });

        return Order.getAllTaskOfShipper(Task, OrderStatus, shipperid, taskdate)
            .then(function(tasks) {
                res.status(200).json(tasks);
            }, function(err) {
                next(err);
            })
    };

    return {
        get: get
    }

}
