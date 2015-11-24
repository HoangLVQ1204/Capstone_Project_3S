
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
        return db.issue.getIssueDetail(db.orderissue, db.issuetype, db.issuecategory, id, db.order, db.task, db.orderstatus, db.taskstatus, db.profile)
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
        //console.log(log);
        return db.bannedhistorylog.postNewLog(log)
            .then(function () {
                db.user.updateUserStatus(log.storeid, log.userStatus)
                    .then(function () {
                        res.status(201).json('OK');
                    });
            }, function (err) {
                next(err);
            })
    };

    var createNewIssue = function(shipperID) {
        //Create issue
        var listOrders = [];
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
                    _.each(tasks, function(task){
                        listOrders.push(task.orderid);
                    })
                    console.log("issueManage:70: ", listOrders);
                    //Add new issue
                    db.issue.createNewIssue(issueDisconnect)
                    .then(function(issue){
                        //Add new notification
                        var msgDisconnectToAdmin = {
                            type: 'Issue',
                            title: 'Issue',
                            content: 'Shipper ' + shipperID + ' is disconnected',
                            url: '#/admin/issueBox/content?issueid=' + issue.dataValues.issueid,
                            isread: false,
                            createddate: new Date()
                        };

                        var msgDisconnectToStore = {
                            type: 'Info',
                            title: 'Warning',
                            content: 'Some orders are in trouble. We are repairing',
                            url: '#/store/dashboard',
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
                            .then(function(data) {
                                console.log('shipperController:401', data.length);
                                return db.order.getStoresOfOrder(listOrders);
                            })
                            .then(function(storeIDs){
                                storeIDs = _.uniq(storeIDs, 'storeid');
                                console.log('isssueManage:112', storeIDs);
                                storeIDs = storeIDs.map(function(e){
                                    return e.storeid;
                                });
                                return db.managestore.getOwnerOfStore(storeIDs);
                            })
                            .then(function(ownerStores) {
                                ownerStores = ownerStores.map(function (e) {
                                    return e.toJSON();
                                });
                                console.log('issManage:119', ownerStores);

                                //insert to notification to store
                                var promises = ownerStores.map(function (e) {
                                    var data = _.clone(msgDisconnectToStore, true);
                                    data.username = e.managerid;
                                    console.log('data', data);
                                    return db.notification.addNotification(data);
                                });

                                return Promise.all(promises);
                            })
                            .then(function (data) {
                                console.log('issueManage:135', data.length);
                                console.log('send notification disconnect to store and admin');
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
                                server.socket.forward(
                                    sender,
                                    {
                                        type: 'room',
                                        room: shipperID
                                    },
                                    msgDisconnectToStore,
                                    'store:issue:pending'
                                );
                            });
                    });
                }
            }, function(err){
                console.log('Insert new issue get an error');
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
        createNewIssue: createNewIssue,
        getUserGetIssue: getUserGetIssue
    }
}