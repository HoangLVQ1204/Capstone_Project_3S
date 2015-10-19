/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');

module.exports = function (app) {

    var db = app.get('models');

    var get = function(req,res,next) {
        var shipperid = 'hoang';
        var taskdate = '2015-10-17';
        var Task = db.task;
        var Order = db.order;
        Task.hasMany(db.order, {
            foreignKey: 'taskid',
            constraints: false
        });
        return Task.getAllTaskOfShipper(Order, shipperid, taskdate)
            .then(function (tasks) {
                res.status(200).json(tasks);
            }, function (err) {
                next(err);
            })
    };

    var getHistory = function (shipperid, next) {
        var History = db.task;
        var Order = db.order;
        History.hasMany(db.order, {
            foreignKey: 'taskid',
            constraints: false
        });
        return History.getAllHistoryOfShipper(shipperid, Order)
            .then(function (history) {
                var list = [];
                history.map(function (order) {
                    list.push({'id': order.dataValues.id, 'code': order.dataValues.orders[0].dataValues.code, 'statusid': order.dataValues.orders[0].dataValues.statusid, 'date': order.dataValues.orders[0].dataValues.taskdate, 'fee': order.dataValues.orders[0].dataValues.fee, 'COD': order.dataValues.orders[0].dataValues.cod});
                    console.log(1);
                    console.log(order.dataValues.orders[0].dataValues.code);
                });
                return list;
            }, function (err) {
                next(err);
            })
    };

    return {
        get: get,
        getHistory: getHistory
    }

}
