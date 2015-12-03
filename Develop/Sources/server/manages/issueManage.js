
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

    var getIssueDetail = function (id) {
       // console.log(id);
        return db.issue.getIssueDetail(db.orderissue, db.issuetype, db.issuecategory, id, db.order, db.task, db.orderstatus, db.taskstatus, db.profile)
            .then(function (issue) {
                var rs = issue.orderissues.map(function (order) {
                    var addr = order.order.getCustomerAddress();
                    order = order.toJSON();
                    order.order['deliveryaddress'] = addr;
                    return order;
                })
                //console.log(rs);
                issue = issue.toJSON();
                issue.orderissues = rs;
                return issue;
            }, function (err) {
                throw err;
            })
    };

    var updateResolveIssue = function (id, resolvetype) {
       // console.log(id);
        return db.issue.updateResolveIssue(id, resolvetype)
            .then(function (issue) {
                return issue;
            }, function (err) {
               throw err;
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

    /*
    * Create New Issue when shipper disconnect app
    * @author quyennv - 15/11
    */
    var createIssueDisconnect = function(shipperID) {
        //Create issue
        var listOrders = [];
        var newIssueID = null;
        var isSend = false;
        var issueDisconnect = {
            typeid: 8,
            description: 'Shipper ' + shipperID + ' disconnected',
            isresolved: false,
            resolvetype: null,
            createddate: new Date(),
            sender: shipperID
        };
        //Check before Add new issue
        //Get Issue by Shipper(Sender)
        db.issue.getIssueBySender(shipperID)
        .then(function(issue){
            if(_.isEmpty(issue) == false) {
                if (issue.dataValues.isresolved == false) {
                    if (issue.dataValues.typeid == 1 || issue.dataValues.typeid == 2 || issue.dataValues.typeid == 3 || issue.dataValues.typeid == 6 || issue.dataValues.typeid == 8) {
                        isSend = false;
                    } else {
                        isSend = true;
                    }
                } else {
                    isSend = true;
                }

            } else {
                isSend = true;
            }

            //Check Task to Send Issue & Socket
            if(isSend) {
                //Check Task of shipper
                db.order.getLastestTasksOfShipper(db.task, shipperID)
                .then(function (tasks) {

                    //TODO: a order have two 3,4 task
                    if (_.isEmpty(tasks) == false) {
                        _.each(tasks, function(task){
                                listOrders.push(task.orderid);
                        })
                        //Add new issue
                        db.issue.createNewIssue(issueDisconnect)
                        .then(function(issue){
                            newIssueID = issue.dataValues.issueid;
                            //Add new notification
                            var msgDisconnectToAdmin = {
                                type: 'issue',
                                title: 'Issue',
                                content: 'Shipper ' + shipperID + ' is disconnected',
                                url: '#/admin/issueBox/content?issueid=' + issue.dataValues.issueid,
                                isread: false,
                                createddate: new Date()
                            };

                            var msgDisconnectToStore = {
                                type: 'info',
                                title: 'Warning',
                                content: 'Some orders are in trouble. We are repairing',
                                url: '#/store/dashboard',
                                isread: false,
                                createddate: new Date()
                            };

                            // update task status to 'Processing'
                            db.task.getTaskOfShipperByOrder(shipperID, 'pending', [])
                            .then(function(items){
                                var promises = items.map(function(e){
                                    //update task to processing
                                    return db.task.updateTaskStatus(4, e.dataValues.taskid, shipperID);
                                });
                                return Promise.all(promises);
                            })
                            .then(function(data){
                                //INSERT to order issue
                                var newOrderIssue = {};
                                newOrderIssue.issueid = newIssueID;
                                listOrders = _.uniq(listOrders);
                                var promises = listOrders.map(function(orderID){
                                    newOrderIssue.orderid = orderID;
                                    db.orderissue.createOrderIssue(newOrderIssue);
                                    //Change isPending
                                    db.order.changeIsPendingOrder(orderID, true);
                                });

                                return Promise.all(promises);
                            })
                            .then(function(data){
                                //get Admin
                                return db.user.getUserByRole(3);
                            })
                            .then(function(admins){
                                admins = admins.map(function(e) {
                                    return e.toJSON();
                                });
                                //insert notification to user admin
                                var promises = admins.map(function(e){
                                    var newData = _.clone(msgDisconnectToAdmin, true);
                                    newData.username = e.username;
                                    return db.notification.addNotification(newData);
                                });

                                return Promise.all(promises);
                            })
                            .then(function(data) {
                                return db.order.getStoresOfOrder(listOrders);
                            })
                            .then(function(storeIDs){
                                storeIDs = _.uniq(storeIDs, 'storeid');
                                storeIDs = storeIDs.map(function(e){
                                    return e.storeid;
                                });
                                return db.managestore.getOwnerOfStore(storeIDs);
                            })
                            .then(function(ownerStores) {
                                ownerStores = ownerStores.map(function (e) {
                                    return e.toJSON();
                                });
                                //insert to notification to store
                                var promises = ownerStores.map(function (e) {
                                    var data = _.clone(msgDisconnectToStore, true);
                                    data.username = e.managerid;
                                    return db.notification.addNotification(data);
                                });

                                return Promise.all(promises);
                            })
                            .then(function (data) {
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
            }

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
        createIssueDisconnect: createIssueDisconnect,
        getUserGetIssue: getUserGetIssue
    }
}