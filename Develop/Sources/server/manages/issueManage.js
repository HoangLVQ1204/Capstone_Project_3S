
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getAllIssue = function (req, res, next) {

        return db.issue.getAllIssue(db.issuetype, db.issuecategory)
            .then(function (issue) {
                res.status(200).json(issue);
            }, function (err) {
                next(err);
            })
    };

    var getIssueDetail = function (req, res, next) {
        var id = req.query.issueid;
       // console.log(id);
        return db.issue.getIssueDetail(db.orderissue, db.issuetype, db.issuecategory, id, db.order, db.task, db.orderstatus, db.taskstatus)
            .then(function (issue) {
                res.status(200).json(issue);
            }, function (err) {
                next(err);
            })
    };

    var updateResolveIssue = function (req, res, next) {
        var id = req.query.issueid;
        var updateIssue = req.body;
       // console.log(id);
        return db.issue.updateResolveIssue(id, updateIssue.resolvetype)
            .then(function (issue) {
                res.status(200).json(issue);
            }, function (err) {
                next(err);
            })
    };

    var postBannedLog = function (req, res, next) {
        var log = req.body;
        console.log(log);
        return db.bannedhistorylog.postNewLog(log)
            .then(function (log) {
                res.status(201).json(log);
            }, function (err) {
                next(err);
            })
    };

    var getUserGetIssue = function (req, res, next) {
        var log = req.body;
        console.log(log);
        return db.issue.getUserGetIssue()
            .then(function (list) {
                res.status(200).json(list);
            }, function (err) {
                next(err);
            })
    };


    return {
        getAllIssue: getAllIssue,
        getIssueDetail: getIssueDetail,
        updateResolveIssue: updateResolveIssue,
        postBannedLog: postBannedLog,
        getUserGetIssue: getUserGetIssue
    }
}