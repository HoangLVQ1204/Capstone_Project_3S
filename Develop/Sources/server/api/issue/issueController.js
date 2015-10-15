/**
 * Created by Kaka Hoang Huy on 10/13/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var sm = require('./shipperManagement')(app);
    var db = app.get('models');
    var get = function (req, res, next) {
        var newIssue = _.cloneDeep(req.body);
        db.issues.findAll({
            attributes: ["issueid", "category", "priority", "description"],
            where: {
                category: 1
            }
        })
            .then(function (users) {
                res.status(200).json(users.map(function (user) {
                    return user.toJSON();
                }));
            }, function (err) {
                next(err);
            })
    };

    var post = function (req, res, next) {
        var newIssue = _.cloneDeep(req.body); // why need to use cloneDeep?
        //console.log(req.body);
        //console.log(newIssue);
        newIssue = {
            issueid: '1',
            category: '1',
            priority: '1',
            description: 'dswfqewrf'
        };

        var issueObj = db.issues;
        issueObj.updaute(newIssue,
            {
                where: {issueid: 1}
            })
            .then(function (i) {
                res.status(200).json("OK");
            }, function (err) {
                res.status(404).json("NOK: " + err);
                //next(err);
            })
        //res.status(200).json("OK");
    };

    var params = function (req, res, next, issue_id) {
        console.log(req);
        db.issues.findAll({
            attributes: ["issueid", "category", "priority", "description"],
            //attributes: '',
            where: {
                issueid: issue_id
            }
        })
            .then(function (users) {
                res.status(200).json(users.map(function (user) {
                    return user.toJSON();
                }));
            }, function (err) {
                next(err);
            })
    };

    var getOnes = function (req, res, next) {
        var status, err;
        var resultSet = sm.listAllIssues(1, status, err);
        res.status(status).json(users.map(function (user) {
            return user.toJSON();
        }));
    };

    var getAll = function (req, res, next) {
        var status, err, resultSet;
        sm.listAllIssues(response);
        function response(status, err, result) {
            if (err == '')
                res.status(status).json(result.map(function (rs) {
                    return rs.toJSON();
                }));
            else res.status(status).json(err);
        }

    };

    return {
        get: get,
        getOne: getOnes,
        post: post,
        //put: put,
        //del: del,
        params: params,
        getAll: getAll
    }
};