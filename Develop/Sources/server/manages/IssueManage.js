
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getAllIssue = function (req, res, next) {

        return db.issue.getAllIssue(db.orderissue, db.issuetype, db.issuecategory)
            .then(function (issue) {
                res.status(200).json(issue);
            }, function (err) {
                next(err);
            })
    };


    return {
        getAllIssue: getAllIssue,
    }
}