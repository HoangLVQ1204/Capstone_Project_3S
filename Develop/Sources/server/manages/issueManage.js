
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');
    var server = app.get('io');

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

    var createNewIssue = function(shipperID) {
        //Create issue
        var issueDisconnect = {
            typeid: 8,
            description: 'Shipper ' + shipperID + ' disconnected',
            isresolved: false,
            resolvetype: null,
            createddate: new Date(),
            sender: shipperID
        };
        //Check Task of shipper is disconnected
        db.order.getAllTaskOfShipper(db.task, shipperID)
            .then(function (tasks) {
                if (_.isEmpty(tasks) == false) {
                    //Add new issue
                    db.issue.createNewIssue(issueDisconnect)
                    .then(function(issue){
                        //Add new notification
                        var msgDisconnectToAdmin = {
                            type: 'Issue',
                            title: 'Issue',
                            content: 'Shipper ' + shipperID + ' had sent an issue',
                            url: '#/admin/issueBox/content?issueid=' + issue.dataValues.issueid,
                            isread: false,
                            createddate: new Date()
                        };
                        //Get admin
                        db.user.getUserByRole(3)
                            .then(function(admins){
                                admins = admins.map(function(e) {
                                    return e.toJSON();
                                });
                                var promises = admins.map(function(e){
                                    var newData = _.clone(msgDisconnectToAdmin, true);
                                    newData.username = e.username;
                                    return db.notification.addNotification(newData);
                                });

                                return Promise.all(promises);
                            })
                            .then(function(data){
                                //send socket
                                var sender = {
                                    type: 'shipper',
                                    clientID: shipperID
                                };
                                server.socket.forward(
                                    sender,
                                    'admin',
                                    msgDisconnectToAdmin,
                                    'admin::issue:disconnected'
                                );
                            });
                    });
                } else {
                    //Do nothing
                }
            }, function(err){
                console.log('Insert new issue get anerror');
            });
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
        createNewIssue: createNewIssue
        getUserGetIssue: getUserGetIssue
    }
}