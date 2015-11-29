/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');
var configConstant = require('../config/configConstant');
// var server = require('../server');

module.exports = function (app) {

    var db = app.get('models');
    var server = app.get('io');

    /*
     * Get all task of Shipper @quyennv
     */
    var getTask = function (req, res, next) {
        var shipperid = req.user.username;
        //var taskdate = '2015-02-15';
        var task = db.task;
        var order = db.order;

        return order.getAllTaskOfShipper(task, shipperid)
            .then(function (tasks) {
                var group = {};
                if (_.isEmpty(tasks) == false) {
                    var listTasks = [];
                    _.each(tasks, function(task){
                        listTasks.push({
                            'orderid': task.dataValues.orderid,
                            'taskid': task['tasks'][0].dataValues.taskid,
                            'typeid': task['tasks'][0].dataValues.typeid,
                            'isPending': task.dataValues.ispending,
                            'statusid': task['tasks'][0].dataValues.statusid,
                            'pickupaddress': task.dataValues.pickupaddress,
                            'deliveryaddress': task.dataValues.deliveryaddress,
                            'pickupdate': task.dataValues.pickupdate,
                            'deliverydate': task.dataValues.deliverydate
                        });
                    });
                    //Group by order type
                    group['Pickup'] = group['Pickup'] || [];
                    group['Ship'] = group['Ship'] || [];
                    group['Express'] = group['Express'] || [];
                    group['Return'] = group['Return'] || [];
                    _.each(listTasks, function (item) {
                        if (_.isEqual(item['typeid'], 1)) {
                            group['Pickup'].push(item);
                        } else if (_.isEqual(item['typeid'], 2)) {
                            group['Ship'].push(item);
                        } else if (_.isEqual(item['typeid'], 3)) {
                            group['Express'].push(item);
                        } else {
                            group['Return'].push(item);
                        }
                    });
                }
                res.status(200).json(group);
            }, function (err) {
                next(err);
            })
    };

    var getHistory = function (req, res, next) {
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        var page = _.cloneDeep(req.query.page);
        page = page? page : 0;
        var History = db.task;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var getHistory = History.getAllHistoryOfShipper(shipperid, page, Order, OrderStatus);
        var getTotal = History.countTotalTaskHistoryOfShipper(shipperid);
        Promise.all([getHistory, getTotal])
            .then(function (p) {
                var history = (p[0]) ? p[0] : [];
                var total = (p[1]) ? p[1] : 0;
                var listHistory = [];
                history.map(function (order) {
                    order = order.toJSON();
                    var dateWithoutHour = new Date(order.date);
                    dateWithoutHour.setHours(0, 0, 0, 0);
                    dateWithoutHour = dateWithoutHour.getTime();
                    listHistory.push({
                        'id': order.id,
                        'date': dateWithoutHour,
                        'time': order.date,
                        'code': order.order.code,
                        'taskstatus': order.taskstatus,
                        'statusid': order.order.orderstatus.statusid,
                        'fee': order.order.fee,
                        'COD': order.order.cod
                    });
                });
                var curentPageResult = _.chain(listHistory)
                    .groupBy("date")
                    .pairs()
                    .map(function (currentItem) {
                        return _.object(_.zip(["date", "taskOfDate"], currentItem));
                    })
                    .value();
                var result = {};
                result['current'] = curentPageResult;
                result['total'] = total;
                return res.status(200).json(result);
            }, function (err) {
                next(err);
            })
    };

    var paramOrderId = function (req, res, next, detailtaskid) {
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var Goods = db.goods;
        var Task = db.task;
        //var shipper = _.cloneDeep(req.user);
        //var shipperid = shipper.username;
        var shipperid = 'SP000001';
        Order.getOrderDetailById(detailtaskid, shipperid, OrderStatus, Goods, Task)
            .then(function (rs) {
                if (rs) {
                    rs = rs.toJSON();
                    var type = rs.tasks[0].typeid;
                    if(rs.tasks[0].typeid == 1){
                        delete rs['deliveryaddress'];
                        delete rs['completedate'];
                    }
                    var statuslist = configConstant.statusList[type];
                    req.statuslist = statuslist;
                    req.detail = rs;
                    //req.details = {
                    //    code: rs.orderid,
                    //    statusid: rs.statusid,
                    //    storeid: rs.storeid,
                    //    ordertypeid: rs.ordertypeid,
                    //    pickupaddress: rs.pickupaddress,
                    //    deliveryaddress: rs.deliveryaddress,
                    //    pickupdate: rs.pickupdate,
                    //    deliverydate: rs.deliverydate,
                    //    recipientphone: rs.recipientphone,
                    //    recipientname: rs.recipientname,
                    //    fee: rs.fee,
                    //    cod: rs.cod,
                    //    //pickupaddresscoordination: rs.pickupaddresscoordination.split(','),
                    //    //deliveryaddresscoordination: rs.deliveryaddresscoordination.split(','),
                    //    status: rs.orderstatus.status, // No need to get status name
                    //    //stockid: 1, // Need to get stock info (join with stock)
                    //    weight: rs.goods[0].weight,
                    //    lengthsize: rs.goods[0].lengthsize,
                    //    widthsize: rs.goods[0].widthsize,
                    //    heightsize: rs.goods[0].heightsize,
                    //    description: rs.goods[0].description
                    //};
                    next();
                } else {
                    next(new Error('No order with id' + orderid));
                }
            }, function (err) {
                next(err);
            });
    };

    var getDetail = function (req, res, next) {
        var detailtaskid = req.query.taskid;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var Goods = db.goods;
        var Task = db.task;
        var Store = db.store;
        var Stock = db.stock;
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        Order.getOrderDetailById(detailtaskid, shipperid, OrderStatus, Goods, Task, Store, Stock)
            .then(function (rs) {
                if (rs) {
                    rs = rs.toJSON();
                    var type = rs.tasks[0].typeid;
                    if(rs.tasks[0].typeid == 1){
                        delete rs['deliveryaddress'];
                        delete rs['completedate'];
                    }
                    req.statuslist = configConstant.statusList[type];
                    req.detail = rs;
                    var resObj = {
                        "detail": req.detail,
                        "statuslist": req.statuslist
                    };
                    return res.status(200).json(resObj);
                } else {
                    return res.status(400).json('Can not found this task detail');
                }
            }, function (err) {
                return res.status(400).json('Can not found this task detail');
            });
    };

    var getOrderStatusList = function (req, res, next) {
        var rs = configConstant.statusList;
        return res.status(200).json(rs);
    };

    var nextStep = function (req, res, next) {
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        var Order = db.order;
        var Task = db.task;
        var data = _.cloneDeep(req.body);
        if (data) {
            var key = data.code;
            var taskid = data.taskid;
            Order.shipperGetOneOrder(taskid, key, shipperid, Task).then(function (orderObj) {
                if (orderObj) {
                    // DATA TO SEND SOCKET
                    var receiver = {
                        type: 'store',
                        clientID: orderObj.storeid
                    };

                    var msg = {
                        type: 'info',
                        title: 'Info: Change Status Order',
                        content: orderObj.orderid + " changes status.",
                        url: '#/store/orderdetail?orderid='+orderObj.orderid,
                        isread: false,
                        username: orderObj.storeid,
                        createddate: new Date()
                    };

                    var msgAdmin = {};

                    var customer = {
                        order: [orderObj.orderid],
                        geoText: orderObj.deliveryaddress
                    };
                    // DATA TO RESPONSE CLIENT
                    var oldStatus = orderObj.statusid;
                    var pickUpStatusID = 2;
                    var nextStatus = 0;
                    var isRequireCode = false;
                    // :TODO Need to check is canceled
                    // :TODO Need to check is canceled
                    var statusList = configConstant.statusList[orderObj.tasks[0].typeid];
                    var taskBegin = statusList[0];
                    var taskDone = statusList[statusList.length - 1];
                    for (var i = 0; i < statusList.length; i++) {
                        var st = statusList[i];
                        if (orderObj.statusid < st.statusid) {
                            nextStatus = st.statusid;
                            break;
                        } else {
                            nextStatus = st.statusid;
                            isRequireCode = st.requiredcode;
                        }
                    }
                    var completeDate = (nextStatus == configConstant.doneStatus)? new Date(): orderObj.completedate;
                    var stockID = (nextStatus == configConstant.inStockStatus)? configConstant.stockID : null;
                    if (isRequireCode) {
                        db.confirmationcode.checkCode(key, data.confirmcode, orderObj.statusid)
                            .then(function (codeObj) {
                            if (codeObj) {
                                orderObj.updateOrderStatus(nextStatus, completeDate, stockID).then(function (rs) {
                                    if(oldStatus == pickUpStatusID){
                                        db.profile.getProfileUser(shipperid).then(function(profile){
                                            msg['profile'] = profile;
                                            msg['order'] = orderObj.orderid;
                                            server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
                                        });
                                    }else {
                                        server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
                                    }
                                    // SEND SOCKET FOR ADMINS
                                    server.socket.forward('server', 'admin', msgAdmin, 'shipper:change:order:status');
                                    db.managestore.getUsersByStoreID(orderObj.storeid).then(function (rs) {
                                        var manager = '';
                                        if (rs.length > 0) manager = rs[0].dataValues.manager;
                                        msg['username'] = manager;
                                        db.notification.addNotification(msg);
                                    });
                                    if(oldStatus == taskBegin.statusid){
                                        Task.updateTaskStatus(configConstant.taskActive, taskid, shipperid).then(function (ok) {
                                            server.socket.startTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                            return res.status(200).json("Your task was active!");
                                        },function(er){
                                            return res.status(400).json("Sorry! Something went wrong!");
                                        });
                                    }else if(nextStatus == taskDone.statusid){
                                        Task.updateTaskStatus(configConstant.taskDone,taskid,shipperid).then(function(ok){
                                            server.socket.finishTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                            return res.status(200).json("Your task was done!");
                                        },function(er){
                                            return res.status(400).json("Sorry! Something went wrong!");
                                        });
                                    }else{
                                        return res.status(200).json("Your order has been moved to next step! Continue your work!");
                                    }
                                }, function (er) {
                                    return res.status(400).json("Update failed!");
                                });
                            } else {
                                return res.status(400).json("Wrong Code!");
                            }
                        }, function (err) {
                            return res.status(400).json("Wrong Code!");
                        });
                    } else {
                        orderObj.updateOrderStatus(nextStatus, completeDate, stockID)
                            .then(function (rs) {
                            server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
                            // SEND SOCKET FOR ADMINS
                            server.socket.forward('server', 'admin', msgAdmin, 'shipper:change:order:status');
                            db.managestore.getUsersByStoreID(orderObj.storeid).then(function(rs){
                                var manager = '';
                                if(rs.length>0) manager = rs[0].dataValues.manager;
                                msg['username'] = manager;
                                db.notification.addNotification(msg);
                            });
                            if(oldStatus == taskBegin.statusid){
                                Task.updateTaskStatus(configConstant.taskActive,taskid,shipperid).then(function(ok){
                                    server.socket.startTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                    return res.status(200).json("Your task was active!");
                                },function(er){
                                    return res.status(400).json("Sorry! Something went wrong!");
                                });
                            }else if(nextStatus == taskDone.statusid){
                                Task.updateTaskStatus(configConstant.taskDone,taskid,shipperid).then(function(ok){
                                    server.socket.finishTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                    return res.status(200).json("Your task was done!");
                                },function(er){
                                    return res.status(400).json("Sorry! Something went wrong!");
                                });
                            }else{
                                return res.status(200).json("Your order has been moved to next step! Continue your work!");
                            }
                        }, function (er) {
                            return res.status(400).json("Update failed!");
                        });
                    }
                }else{
                    return res.status(400).json("Update failed!");
                }
            }, function () {
                return res.status(400).json("Can't find this order!");
            });
        }
        else{
            return res.status(400).json("Can't go to next step");
        }
    };

    /*
     * create Issue @quyennv
     */
    var createIssue = function (req, res, next) {
        var issueType;
        var task = db.task;
        var listStores = [];
        //Instance new Issue
        var newIssue = _.cloneDeep(req.body[0].issue);
        var shipperID = req.user.username;
        newIssue.isresolved = false;
        newIssue.resolvetype = null;
        newIssue.createddate = new Date();
        newIssue.sender =  shipperID;
        var orders = _.cloneDeep(req.body[0].orders);
        var categoryissue = _.cloneDeep(req.body[0].categoryissue);
        console.log('shipperController:357 -- newIssue', newIssue);
        db.issue.createNewIssue(newIssue)
            .then(function(issue) {
                issueType = issue.dataValues.typeid;
                //UPDATE task status of task to 'Processing'
                //Case: Pending
                var newStatus = 4;
                if (_.parseInt(categoryissue) === 1) {
                    task.getTaskOfShipperByOrder(shipperID, 'pending', [])
                        .then(function(items){
                                _.each(items, function(subitem){
                                    //update task to processing
                                    task.updateTaskStatus(newStatus, subitem.dataValues.taskid, shipperID);
                                });
                        }, function (err) {
                            next(err);
                        });
                } else {
                //Case: Cancel
                    if (orders.length == 0) {
                        next(new Error('Can not find orders get issue'));
                    }
                    task.getTaskOfShipperByOrder(shipperID, 'cancel', orders)
                        .then(function(item){
                            _.each(item, function(subitem){
                                //update task to processing
                                task.updateTaskStatus(newStatus, subitem.dataValues.taskid, shipperID);
                            });
                        }, function(err){
                            next(err);
                        });
                }

                //INSERT into orderissue
                var newOrderIssue = {};
                newOrderIssue.issueid = issue.issueid;
                var isPending = true;
                _.each(orders, function(orderID) {
                    newOrderIssue.orderid = orderID;
                    db.orderissue.createOrderIssue(newOrderIssue);
                    if (_.parseInt(categoryissue) === 1) {
                        //Change isPending
                        db.order.changeIsPendingOrder(orderID, isPending);
                    }
                });

                // SEND socket and insert notification
                // Lay cac storeID to orderID
                // Lay adminID
                // Sinh ra cac notification and insert vao bang notification
                var receiver = [
                    { room: req.user.username },
                    'admin'
                ];

                var msgToAdmin = {
                    type: 'issue',
                    title: 'Issue:',
                    content: 'Shipper ' + shipperID + ' sent an issue.',
                    url: '#/admin/issueBox?content?issueid=' + issue.dataValues.issueid,
                    isread: false,            
                    createddate: new Date()
                };

                var msgToStore = {
                    type: 'issue',
                    title: 'Issue:',
                    content: 'Some orders are in trouble. We are repairing.' ,
                    url: '#/store/dashboard',
                    isread: false,
                    createddate: new Date()
                };

                db.user.getUserByRole(3)
                .then(function(admins) {
                    admins = admins.map(function(e) {
                        return e.toJSON();
                    })
                    console.log('shipperController:446', admins);
                    // insert to notification
                    var promises = admins.map(function(e) {
                        var data = _.clone(msgToAdmin, true);
                        data.username = e.username;
                        console.log('data', data);
                        return db.notification.addNotification(data);
                    });

                    return Promise.all(promises);
                })
                .then(function(data) {
                    console.log('shipperController:458', data.length);
                    return db.order.getStoresOfOrder(orders);
                })
                .then(function (storeIDs) {
                    storeIDs = _.uniq(storeIDs, 'storeid');
                    console.log('StoreID:463', storeIDs);
                    storeIDs = storeIDs.map(function(e){
                        return e.storeid;
                    });
                    listStores = _.clone(storeIDs, true);
                    return db.managestore.getOwnerOfStore(storeIDs);
                })
                .then(function(ownerStores) {
                    ownerStores = ownerStores.map(function(e) {
                        return e.toJSON();
                    });
                    console.log('shipperController:473', ownerStores);

                    // insert to notification to store
                    var promises = ownerStores.map(function(e) {
                        var data = _.clone(msgToStore, true);
                        data.username = e.managerid;
                        console.log('data', data);
                        return db.notification.addNotification(data);
                    });

                    return Promise.all(promises);
                    
                })
                .then(function(data) {
                    console.log('shipperController:480', data.length);
                    console.log('send notification to store and admin');
                    // Send socket
                    var sender = {
                        type: 'shipper',
                        clientID: shipperID
                    };
                    server.socket.forward(
                        sender,
                        'admin',
                        {
                            notification: msgToAdmin
                        },
                        'admin:issue:notification'
                    );
                    //Issue Pending
                    if (_.parseInt(categoryissue) === 1) {
                        server.socket.forward(
                            sender,
                            {
                                type: 'room',
                                room: shipperID
                            },
                            msgToStore,
                            'store:issue:pending'
                        );
                    //Issue Cancel
                    } else if (_.parseInt(categoryissue) === 2) {
                        console.log("shipperMaanges:516", listStores);
                        listStores.forEach(function(storeID){
                            server.socket.forward(
                                sender,
                                {
                                    type: 'store',
                                    clientID: storeID
                                },
                                msgToStore,
                                'store:issue:pending'
                            );
                        });
                    }


                });

                //Respon data

                // Insert into orderissue
                //var newOrderIssue = {};
                //newOrderIssue.issueid = issue.issueid;
                //var isPending = true;
                //_.each(orders, function(orderID) {
                //    newOrderIssue.orderid = orderID;
                //    db.orderissue.createOrderIssue(newOrderIssue);
                //    if (_.parseInt(categoryissue) === 1) {
                //        //Change isPending
                //        db.order.changeIsPendingOrder(orderID, isPending);
                //    }
                //});
                var group = [];
                group.push({
                    'issueid': issue.dataValues.issueid,
                    'catissue': categoryissue
                });

                // Update data in socket
                var listPending = [1,2,3,6];
                if(listPending.indexOf(issueType) >= 0){
                    server.socket.updatePendingOrder(shipperID, true);
                };

                res.status(200).json(group);
            }, function (err) {
                next(err);
            });
    };

    /*
     * Change is pending of order @quyennv
     */
    var changeIsPending = function(req, res, next) {
        //console.log('quyen', req.user.username);
        var shipperid = req.user.username;
        var issueId = req.body.issueId;
        var task = db.task;
        var order = db.order;
        var orderissue = db.orderissue;
        var issue = db.issue;
        var issuetype = db.issuetype;
        issue.hasMany(orderissue, {
            foreignKey: 'issueid',
            constraints: false
        });
        orderissue.belongsTo(order, {
            foreignKey: 'orderid',
            constraints: false
        });
        issue.belongsTo(issuetype, {
            foreignKey: 'typeid',
            constraints: false
        });
        task.belongsTo(order,{
            foreignKey: 'orderid',
            constraints: false
        });
        var resMess = [
            {"id": 1, "content": "Your Issue is not resolved. Please waiting for Admin or contact to Admin."},
            {"id": 2, "content": "Your all active task is Fail. Please confirm with Admin"},
            {"id": 3, "content": "You can continue"}
        ];
        return issue.preChangeIsPending(task, order, issuetype, orderissue, shipperid, issueId)
            .then(function(tasks){
                var listOrdersOfCurrentShip = [];
                var listOrdersAsignToOther = [];
                if(_.isEmpty(tasks) == false) {
                    _.each(tasks, function(task){
                        //Issue of current task not resolved -> Waiting for Admin
                        if (task.isresolved == false) {
                            //console.log(resMess[0]);
                            res.status(200).json(resMess[0]);
                        } else {
                            _.each(task['orderissues'], function(item) {
                                //If admin assign task for another shipper
                                if (item.order['tasks'][0].statusid == 5) {
                                    listOrdersAsignToOther.push(item.orderid);
                                } else {
                                    //status of task = 2
                                    listOrdersOfCurrentShip.push(item.orderid);
                                }
                            })
                        }
                    });
                    if (listOrdersAsignToOther.length > 0) {
                        //TODO: Assign to other shipper. Current shipper cannot update order
                        //_.each(listOrdersFail, function(orderID) {
                        //    //Change isPending
                        //    db.order.changeIsPendingOrder(orderID, false);
                        //});
                        res.status(200).json(resMess[1]);
                    }
                    if (listOrdersOfCurrentShip.length > 0) {
                        var msgToStore = {
                            type: 'info',
                            title: 'Info:',
                            content: 'Shipper continued your orders!',
                            url: '#/store/dashboard',
                            isread: false,
                            createddate: new Date()
                        };
                        //change isPending of Order
                        _.each(listOrdersOfCurrentShip, function(orderID) {
                            //Change isPending
                            db.order.changeIsPendingOrder(orderID, false);
                        });
                        //add new notification
                        db.order.getStoresOfOrder(listOrdersOfCurrentShip)
                        .then(function(storeIDs){
                            storeIDs = _.uniq(storeIDs, 'storeid');
                            console.log("storeID:613", storeIDs);
                            storeIDs = storeIDs.map(function(e){
                                return e.storeid;
                            });
                            return db.managestore.getOwnerOfStore(storeIDs);
                            })
                        .then(function(ownerStores){
                            ownerStores = ownerStores.map(function(e) {
                                return e.toJSON();
                            });
                            console.log('shipperController:623', ownerStores);
                            //insert to notification
                            var promises = ownerStores.map(function(e) {
                                var data = _.clone(msgToStore, true);
                                data.username = e.managerid;
                                console.log('data', data);
                                return db.notification.addNotification(data);
                            });
                            return Promise.all(promises);
                        })
                        .then(function (data) {
                            console.log('shipperController:642', data.length);
                            console.log('send notification continue to store');
                            // send socket
                            var sender = {
                                type: 'shipper',
                                clientID: shipperid
                            };
                            server.socket.forward(
                                sender,
                                {
                                    type: 'room',
                                    room: shipperid
                                },
                                msgToStore,
                                'store:issue:continue'
                            );
                            server.socket.updatePendingOrder(shipperid, false);
                            //res mesage continue
                            res.status(200).json(resMess[2]);
                        });
                    }
                }
            }, function(err) {
                next(err);
            })
    };

    var indexInStoreList = function(storeID, listStore){
        return -1;
    };

    var indexInCustomerList = function(geoText, listCustomer){
        return -1;
    };

    var paramMapdata = function (req, res, next, order) {
        var shipperID = 'huykool'; // = req.userid
        var orderModel = db.order;
        db.task.getMapdataById(orderModel, shipperID, order).then(function (dataMap) {
            if (dataMap){
                var shipperList = [{
                    "order": [],
                    "shipperID": shipperID
                }];
                var storeList = [];
                var customerList = [];
                var orderList = {};
                dataMap.map(function(item){
                    item = item.toJSON();
                    // fill data for shippers
                    shipperList[0].order.push(item.orderid);
                    // fill data for stores
                    var posStore = indexInStoreList(item.order.storeID, orderList);
                    if(posStore<0){
                        var storePos = item.order.storePos.split(',');
                        storePos = (storePos.length == 2)? storePos : ['',''];
                        storeList.push({
                            "order": [item.orderid],
                            "latitude": parseFloat(storePos[0]) ? parseFloat(storePos[0]) : 0,
                            "longitude": parseFloat(storePos[1]) ? parseFloat(storePos[1]) : 0,
                            "storeID": item.order.storeID
                        });
                    }else{
                        storeList[posStore].order.push(item.orderid);
                    }
                    // fill data for customers
                    var postCustomer = indexInCustomerList(item.order.customerPos,customerList);
                    if(postCustomer<0){
                        customerList.push({
                            "order":[item.orderid],
                            "geoText": item.order.customerPos
                        });
                    }else{
                        customerList[postCustomer].order.push(item.orderid);
                    }
                    // fill data for orders
                    var key = item.orderid;
                    var orderObj = {
                        "shipperID": item.shipperID,
                        "storeID": item.order.storeID
                    };
                    orderList[key] = orderObj;
                });

                req.dataMap = {
                    "shipper": shipperList,
                    "store": storeList,
                    "customer": customerList,
                    "order": orderList
                };
                next();
            }else{
                next(new Error("No data"));
            }
        }, function (err) {
            next(err);
        });
    };

    var getMapdata = function (req, res, next){
        return res.status(200).json(req.dataMap);
    };

    var getAllShipper = function(req, res, next) {
        return db.user.getAllUsersHasRole(1, db.profile, db.workingstatus)
            .then(function(shipper) {
                res.status(200).json(shipper);
            }, function(err) {
                next(err);
            })
    };

    var getAllOrderToAssignTask = function (req, res, next) {
        var orderList=[];
        var promise=[];
        return db.order.getAllOrderToAssignTask(db.orderstatus, db.task, db.taskstatus)
            .then(function(shipper) {
                shipper.map(function(item) {
                    var order = new Object();
                    order.order = item;
                    if (item.tasks.length == 0) {
                        orderList.push(order);
                    }
                    else {
                        if (item.statusid == 4 && item.tasks.length==1 && item.tasks[0].statusid == 3) {
                            orderList.push(order);
                        }
                        if (item.tasks[item.tasks.length-1].shipperid == null) {
                            var newOrder = new Object();
                            //console.log(item.tasks[item.tasks.length-1].toJSON());
                            newOrder = _.cloneDeep(item.tasks[item.tasks.length-1].toJSON());


                            newOrder['order'] =  _.cloneDeep(item.toJSON());
                            delete  newOrder['order']['tasks'];
                            //newOrder.order = item;
                            orderList.push(newOrder);
                        }
                    }
                })
                res.status(200).json(orderList);
            }, function(err) {
                next(err);
            })

    };

    var getAllShipperWithTask = function (req, res, next) {

        return db.user.getAllShipperWithTask(db.task, db.profile, db.order, db.orderstatus, db.tasktype, db.taskstatus)
            .then(function(shipper) {
                //console.log("--------------Data Task Shipper -------------------");
                //console.log(shipper);
                res.status(200).json(shipper);
            }, function(err) {
                next(err);
            })
    };

    var getAllShipperWithTaskForProcessing = function (req, res, next) {
        var shipperid = req.params.shipperid;
        //console.log(shipperid)
        return db.user.getAllTaskProcessingOfShipper(db.task, db.profile, db.order, db.orderstatus, db.tasktype, db.taskstatus, shipperid)
            .then(function(shipper) {
                //console.log("--------------Data Task Shipper -------------------");
                //console.log(shipper);
                res.status(200).json(shipper);
            }, function(err) {
                next(err);
            })
    };

    var updateTaskForShipper = function (req, res, next) {
        var shipperList = req.body;
        shipperList.forEach(function(shipperTasks){
            if(shipperTasks.tasks) {
                shipperTasks.tasks.forEach(function(task){
                    if(task.statusid === 4){
                        server.socket.changeShipperOfOrder(shipperTasks.username, task.order.orderid);
                    }
                });
            }
        });

        return shipperList.map(function (shipper) {
            shipper.tasks.map(function (task) {
                db.task.assignTaskForShipper(task)
                    .then(function(newTask) {
                         res.status(201).json(newTask);
                        //console.log(newTask.taskid)
                    }, function(err) {
                        next(err);
                    })
            })

        })
    };

    //// START - Get status of shipper
    //// HuyTDH - 03-11-15
    var getShipperStatus = function(req, res, next){
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        var User = db.user;
        //User.getShipperStatus(shipperid).then(function(rs){
        //    rs = rs.toJSON();
        //    var rss = (rs.status != 1);
        //    res.status(200).json(rss);
        //},function(er){
        //    res.status(400).json("Cant not get status of shipper!");
        //});
        //// TODO: Only change status on socket
        res.status(200).json({'status': true});
    };
    //// END - Get status of shipper
    /*
    * Get all Task of Shipper tobe Issue @quyennv
    */
    var getTaskBeIssuePending = function (req, res, next) {
        var shipperid = req.user.username;
        var task = db.task;
        var order = db.order;
        var orderissue = db.orderissue;
        var issue = db.issue;
        var issuetype = db.issuetype;
        order.hasMany(orderissue, {
           foreignKey: 'orderid',
            constraints: false
        });
        task.belongsTo(order,{
            foreignKey: 'orderid',
            constraints: false
        });
        orderissue.belongsTo(issue, {
            foreignKey: 'issueid',
            constraints: false
        });
        issue.belongsTo(issuetype, {
            foreignKey: 'typeid',
            constraints: false
        });

        return order.getTaskBeIssuePending(task, issue, issuetype, orderissue, shipperid)
            .then(function(tasks){
                var group = {};
                if(_.isEmpty(tasks) == false) {
                    _.each(tasks, function(task){
                            group[task['orderissues'][0].issueid] = group[task['orderissues'][0].issueid] || [];
                            group[task['orderissues'][0].issueid].push({
                                'orderid': task.orderid,
                                'ispending': task.ispending,
                                'isresolved': task['orderissues'][0].issue.isresolved,
                                'taskid': task['tasks'][0].taskid
                            });
                    });
                }
                res.status(200).json(group);
            }, function(err) {
                next(err);
            })
    };

    //// START count task of shipper
    //// HuyTDH 03-11-15
    var countTaskOfShipper = function(req, res, next){
        var shipperid =  req.user.username;
        var Task = db.task;
        var TaskStatus = db.taskstatus;
        TaskStatus.getAllTaskStatus().then(function(st){
            var ls = {};
            st.forEach(function(it){
                it = it.toJSON();
                ls[it.statusid] = it.statusname
            });
            Task.countTaskByShipperId(shipperid, TaskStatus).then(function(rs){
                var tasks = {};
                rs.forEach(function(item){
                    item = item.toJSON();
                    var obj = {};
                    var key = '';
                    var num = parseInt(item.count)? parseInt(item.count) : 0;
                    tasks[ls[item.statusid]] = num;
                    //tasks.push(obj);
                });
                res.status(200).json(tasks);
            },function(er){
                res.status(400).json(er);
            });
        },function(err){
            res.status(400).json(err);
        });
    };
    //// END count task of shipper

    //// START change status of shipper
    //// HuyTDH 03-11-15
    var changeShipperStatus = function(req, res, next){
        var shipperid =  req.user.username;
        var data = _.cloneDeep(req.body);
        var User = db.user;
        User.findUserByUsername(shipperid)
        .then(function(shipper){
             if(shipper){
                 shipper.workingstatus = data.status;
                User.putUser(shipper).then(function(rs){
                    res.status(200).json("Change status successfully!");
                }, function(er){
                    res.status(400).json("Can not change your status");
                });
             }
        },function(err){
            res.status(400).json("Can not change your status");
        });
    };
    //// END change status of shipper

    var testSk = function(req, res, next){
        var storeid = 'STR001';
        var storeid2 = 'STR003';
        var shipperid = 'SP000001';
        //var orderid = 'OD025421';
        //addStoreToShipperRoom(storeid,shipperid);
        //addStoreToShipperRoom(storeid2,shipperid);
        //addOrderIntoSocket(orderid, storeid, shipperid);
        //var roomID = server.socket.findSocketIdByShipperId(shipperid);
        var receiver = {
            type: 'room',
            room: shipperid
        };
        var msg = {
            type: "info",
            title: "Test Room",
            content: "You're in room "+ shipperid,
            url: "http://localhost:3000/#/store/dashboard",
            isread: false,
            username: 'ST000003',
            createddate: new Date()
        };
        server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
        var cs = server.socket.customers;
        var sp = server.socket.shippers;
        var st = server.socket.stores;
        var od = server.socket.orders;
        return res.status(200).json({
            "cs": cs,
            "sp": sp,
            "st": st,
            "od": od
        });

    };

    var testSk2 = function(req, res, next){
        var storeid = 'STR001';
        var storeid2 = 'STR003';
        var shipperid = 'SP000001';
        addStoreToShipperRoom(storeid,shipperid);
        addStoreToShipperRoom(storeid2,shipperid);
        addOrderIntoSocket("OD090909", storeid, shipperid);
        addOrderIntoSocket("OD901001", storeid2, shipperid);
        var cs = server.socket.customers;
        var sp = server.socket.shippers;
        var st = server.socket.stores;
        var od = server.socket.orders;
        return res.status(200).json({
            "cs": cs,
            "sp": sp,
            "st": st,
            "od": od
        });

    };

    var testSk3 = function(req, res, next){
        var storeid = 'STR001';
        var storeid2 = 'STR003';
        var shipperid = 'SP000002';
        addStoreToShipperRoom(storeid,shipperid);
        addStoreToShipperRoom(storeid2,shipperid);
        addOrderIntoSocket("OD090909", storeid, shipperid);
        addOrderIntoSocket("OD901001", storeid2, shipperid);
        var cs = server.socket.customers;
        var sp = server.socket.shippers;
        var st = server.socket.stores;
        var od = server.socket.orders;
        return res.status(200).json({
            "cs": cs,
            "sp": sp,
            "st": st,
            "od": od
        });

    };

    //function create new shipperid
    var createShipperID = function(req, res, next){
        var isExisted = false;
        do
        {
            var str = "000000" + parseInt(Math.random()*1000000);
            var formatStr = str.substr(str.length - 6);
            var newShipperID = "SP" + formatStr;
            //console.log(newShipperID);
            db.user.findUserByUsername(newShipperID)
                .then(function(shipper){
                    console.log(newShipperID, shipper);
                    if(!shipper){
                        //console.log('AAA');
                        isExisted = true;
                        res.status(200).json(newShipperID);
                    }
                },function(err){
                    //console.log(newShipperID, shipper);
                    res.status(400).json("Can not get new shipperid");
                });
        } while (isExisted);
    };


    //// START AREA OF HELPER FUNCTIONS (PRIVATE)
    var addStoreToShipperRoom = function(storeid, shipperid){
        var roomID = server.socket.findSocketIdByShipperId(shipperid);
        var store = {
            clientID: storeid,
            type: 'store'
        };
        var socketStore = server.socket.receiverSocket(store);
        if(socketStore && roomID){
            server.socket.addToRoom(socketStore,roomID);
        }
    };

    var removeStoreFromShipperRoom = function(storeid, shipperid){
        var roomID = server.socket.findSocketIdByShipperId(shipperid);
        var store = {
            clientID: storeid,
            type: 'store'
        };
        var socketStore = server.socket.receiverSocket(store);
        if(socketStore){
            server.socket.leaveRoom(socketStore,roomID);
        }
    };

    var addOrderIntoSocket = function(orderID, storeID, shipperID){
        server.socket.addOrder(orderID, storeID, shipperID);
    };

    var removeOrderInSocket = function(orderID){
        server.socket.removeOrder(orderID);
    };

    var getAllShippers = function(){
        return db.user.getAllUsersHasRole(1, db.profile)
            .then(function(shipper) {
                return shipper;
            });
    }

    //// END AREA OF PRIVATE FUNCTION



    return {
        getTask: getTask,
        getHistory: getHistory,
        getDetail: getDetail,
        paramOrderId: paramOrderId,
        getOrderStatusList: getOrderStatusList,
        nextStep: nextStep,
        createIssue: createIssue,
        changeIsPending: changeIsPending,
        paramMapdata: paramMapdata,
        getMapData: getMapdata,
        getAllShipper: getAllShipper,
        getAllOrderToAssignTask: getAllOrderToAssignTask,
        getAllShipperWithTask: getAllShipperWithTask,
        updateTaskForShipper: updateTaskForShipper,
        getShipperStatus: getShipperStatus,
        countTaskOfShipper: countTaskOfShipper,
        changeShipperStatus: changeShipperStatus,
        getTaskBeIssuePending: getTaskBeIssuePending,
        testSk: testSk,
        testSk2: testSk2,
        testSk3: testSk3,
        createShipperID: createShipperID,
        getAllShipperWithTaskForProcessing: getAllShipperWithTaskForProcessing,
        getAllShippers: getAllShippers
    }
}
