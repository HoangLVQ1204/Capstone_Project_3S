
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getAllTask = function (req, res, next) {

        return db.task.getAllTask(db.user, db.order, db.orderstatus, db.taskstatus, db.tasktype, db.store, db.profile)
            .then(function (tasks) {

                res.status(200).json(tasks);
            }, function (err) {
                next(err);
            })
    };

    var getAllTaskStatus = function (req, res, next) {

        return db.taskstatus.getAllTaskStatus()
            .then(function (tasks) {
                //tasks = tasks.toJSON();
                res.status(200).json(tasks);
            }, function (err) {
                next(err);
            })
    };

    var getAllTaskType = function (req, res, next) {

        return db.tasktype.getAllTaskType()
            .then(function (tasks) {
                //tasks = tasks.toJSON();
                res.status(200).json(tasks);
            }, function (err) {
                next(err);
            })
    };

    return {
        getAllTask: getAllTask,
        getAllTaskType: getAllTaskType,
        getAllTaskStatus: getAllTaskStatus
    }
}