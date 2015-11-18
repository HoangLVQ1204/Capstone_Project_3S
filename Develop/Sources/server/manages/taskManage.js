
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

    var updateTaskState = function (req, res, next) {
        var taskList = req.body;
        return taskList.map(function (task) {
                db.task.updateTaskState(task)
                    .then(function (task) {
                        //tasks = tasks.toJSON();
                        res.status(201).json(task);
                    }, function (err) {
                        next(err);
                    })
        })
    };

    var updateTaskNoShipper = function (req, res, next) {
        var taskidlist = req.body;
        return taskidlist.map(function (taskid) {
                db.task.updateShipperOfTask(taskid, null)
                    .then(function (task) {
                        res.status(201).json(task);
                    }, function (err) {
                        next(err);
                    })
        })
    }

    var createTask = function(req,res,next){
        var taskData = req.body;
        return db.task.createTaskForShipper(taskData)
                .then(function(newTask) {
                    console.log(newTask.taskid);
                    res.status(201).json(newTask);
                }, function(err) {
                    next(err);
                })
    };

    var countActiveTaskOfShipper = function(req,res,next){
        var shipperid = req.query.shipperid;
        console.log(shipperid)
        return db.task.countActiveTaskOfShipper(shipperid)
                .then(function(count) {
                    //console.log(newTask.taskid);
                    res.status(200).json(count);
                }, function(err) {
                    next(err);
                })
    };

    var updateTaskStateOfIssue = function (req, res, next) {
        var issue = req.body;
        var promise = [];
        issue.orderissues.map(function (orderissue) {
            //console.log(orderissue.order);
            promise.push(db.task.updateTaskStatusAndType(orderissue.order.tasks[0])
                .then(function (task) {
                    db.order.updateOrderStatus(orderissue.order)
                        .then(function (order) {

                        }, function (err) {
                            next(err);
                        })
                }, function (err) {
                    next(err);
                }));
        });
        return Promise.all(promise).then(function () {
            res.status(201).json('OK');
        }, function (err) {
            next(err);
        })
    };

    var updateStateOfStoreCancelIssue = function (req, res, next) {
        var issue = req.body;
        var promise = [];
        issue.orderissues.map(function (orderissue) {
            //console.log(orderissue.order);
            promise.push(db.task.deleteTask(orderissue.order.tasks[0])
                .then(function (task) {
                    db.order.updateOrderAfterStoreCancel(orderissue.order)
                        .then(function (order) {

                        }, function (err) {
                            next(err);
                        })
                }, function (err) {
                    next(err);
                }));
        });
        return Promise.all(promise).then(function () {
            res.status(201).json('OK');
        }, function (err) {
            next(err);
        })
    };

    return {
        getAllTask: getAllTask,
        getAllTaskType: getAllTaskType,
        getAllTaskStatus: getAllTaskStatus,
        updateTaskState: updateTaskState,
        updateTaskNoShipper: updateTaskNoShipper,
        createTask: createTask,
        countActiveTaskOfShipper: countActiveTaskOfShipper,
        updateTaskStateOfIssue: updateTaskStateOfIssue,
        updateStateOfStoreCancelIssue: updateStateOfStoreCancelIssue
    }
}