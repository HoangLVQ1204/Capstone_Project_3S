/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');

module.exports = function(app) {

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
