/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');
var configConstant = require('../config/configConstant');
var Q = require('q');
// var server = require('../server');

module.exports = function (app) {

    var db = app.get('models');
    var server = app.get('io');

    /*
     * Get all task of Shipper
     * Get All Task Inactive, Active, Processing of Shipper by shipperID
     * @author: quyennv
     */
    var getTasks = function (shipperid) {
        // var shipperid = req.user.username;
        var task = db.task;

        return db.order.getAllTaskOfShipper(task, shipperid)
            .then(function (tasks) {
                // console.log('getAllTaskOfShipper:26', tasks[0].tasks);
                var group = {};
                if (_.isEmpty(tasks) == false) {
                    var listTasks = [];
                    _.each(tasks, function(task){
                        listTasks.push({
                            'orderid': task.dataValues.orderid,
                            'orderstatusid': task.dataValues.statusid,
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
                return group;

            }, function (err) {
                throw err;
            })
    };

    /*
     * By HuyTDH - 10/18/2015
     *
     * This function is used to return json data for task history API
     *
     * */
    var getHistory = function (shipperid, page) {
        if(!parseInt(page)){
            throw new Error("Page is not a number");
        }
        var History = db.task;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var getHistory = History.getAllHistoryOfShipper(shipperid, page, Order, OrderStatus);
        var getTotal = History.countTotalTaskHistoryOfShipper(shipperid);
        return Promise.all([getHistory, getTotal])
            .then(function (p) {
                var history = (p[0]) ? p[0] : [];
                var total = (p[1].dataValues) ? p[1].dataValues : 0;
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
                return result;
            }, function (err) {
                throw new Error(err.message);
            })
    };

    var paramOrderId = function (req, res, next, detailtaskid) {
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var Goods = db.goods;
        var Task = db.task;
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        // var shipperid = 'SP000001';
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
                    next();
                } else {
                    next(new Error('No order with id' + orderid));
                }
            }, function (err) {
                next(err);
            });
    };

    /**
     * By HuyTDH - 10/20/2015
     * This function is used to return json data for task detail API
     * */
    var getDetail = function (shipperid, detailtaskid){
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var Goods = db.goods;
        var Task = db.task;
        var Store = db.store;
        var Stock = db.stock;
        return Order.getOrderDetailById(detailtaskid, shipperid, OrderStatus, Goods, Task, Store, Stock)
            .then(function (rs) {
                if (rs) {
                    rs = rs.toJSON();
                    var type = rs.tasks[0].typeid;
                    if(rs.tasks[0].typeid == 1){
                        delete rs['deliveryaddress'];
                        delete rs['completedate'];
                        delete rs['recipientname'];
                        delete rs['recipientphone'];
                    }
                    var statuslist = configConstant.statusList[type];
                    return {
                        "detail": rs,
                        "statuslist": statuslist
                    };
                } else {
                    throw new Error('Can not find this task detail');
                }
            }, function (err) {
                throw new Error('Can not find this task detail');
            });
    };

    var getOrderStatusList = function (req, res, next) {
        var rs = configConstant.statusList;
        return res.status(200).json(rs);
    };

    /**
     * By HuyTDH - 10/20/2015
     * This function allows shipper to change order status to next step in their task
     */
    var nextStep = function(shipperid, data){
        var Order = db.order;
        var Task = db.task;
        if (data) {
            var key = data.code;
            var taskid = data.taskid;
            return Order.shipperGetOneOrder(taskid, key, shipperid, Task).then(function (orderObj) {
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
                    var msgAdmin = {
                        type: 'info',
                        title: 'Info: Change Status Order',
                        content: orderObj.orderid + " changes status.",
                        taskid: taskid,
                        // url: '#/admin/orderdetail?orderid='+orderObj.orderid
                        url: '#/admin/dashboard'
                    };
                    var msgAdminTask = {
                        orderid: orderObj.orderid
                    };
                    var customer = {
                        order: [orderObj.orderid],
                        geoText: orderObj.deliveryaddress
                    };
                    // DATA TO RESPONSE CLIENT
                    var oldStatus = orderObj.statusid;
                    var pickUpStatusID = 2;
                    var nextStatus = 0;
                    var nextStatusName = '';
                    var isRequireCode = false;
                    var statusList = configConstant.statusList[orderObj.tasks[0].typeid];
                    var taskBegin = statusList[0];
                    var taskDone = statusList[statusList.length - 1];
                    for (var i = 0; i < statusList.length; i++) {
                        var st = statusList[i];
                        if (orderObj.statusid < st.statusid) {
                            nextStatus = st.statusid;
                            nextStatusName = st.statusname;
                            break;
                        } else {
                            nextStatus = st.statusid;
                            nextStatusName = st.statusname;
                            isRequireCode = st.requiredcode;
                        }
                    }
                    // Update status of order
                    server.socket.updateStatusOrder(orderObj.orderid, nextStatusName);

                    var completeDate = (nextStatus == configConstant.doneStatus)? new Date(): orderObj.completedate;
                    var pickedDate = (oldStatus == pickUpStatusID)? new Date(): orderObj.pickupdate;
                    var stockID = (nextStatus == configConstant.inStockStatus)? configConstant.stockID : null;
                    if (isRequireCode) {
                        return db.confirmationcode.checkCode(key, data.confirmcode, orderObj.statusid)
                            .then(function (codeObj) {
                            if (codeObj) {
                                return orderObj.updateOrderStatusShipper(nextStatus, pickedDate, completeDate, stockID).then(function (rs) {
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
                                    if(nextStatus == taskDone.statusid){
                                        return Task.updateTaskStatus(configConstant.taskDone,taskid,shipperid).then(function(ok){
                                            server.socket.finishTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                            return "Your task was done!";
                                        },function(er){
                                            throw new Error("Sorry! Something went wrong!");
                                        });
                                    } else
                                    if(oldStatus == taskBegin.statusid){
                                        return Task.updateTaskStatus(configConstant.taskActive, taskid, shipperid).then(function (ok) {
                                            server.socket.startTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                            server.socket.forward('server', 'admin', msgAdminTask, 'shipper:change:task:active');
                                            return "Your task was active!";
                                        },function(er){
                                            throw new Error("Sorry! Something went wrong!");
                                        });
                                    }else{
                                        return "Your order has been moved to next step! Continue your work!";
                                    }
                                }, function (er) {
                                    throw new Error("Update failed!");
                                });
                            } else {
                                throw new Error("Wrong Code!");
                            }
                        }, function (err) {
                            throw new Error("Checking code failed!");
                        });
                    } else {
                        return orderObj.updateOrderStatusShipper(nextStatus, pickedDate, completeDate, stockID)
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
                            if(nextStatus == taskDone.statusid){
                                return Task.updateTaskStatus(configConstant.taskDone,taskid,shipperid).then(function(ok){
                                    server.socket.finishTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                    return "Your task was done!";
                                },function(er){
                                    throw new Error("Sorry! Something went wrong!");
                                });
                            } else
                            if(oldStatus == taskBegin.statusid){
                                return Task.updateTaskStatus(configConstant.taskActive,taskid,shipperid).then(function(ok){
                                    server.socket.startTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                    server.socket.forward('server', 'admin', msgAdminTask, 'shipper:change:task:active');
                                    return "Your task was active!";
                                },function(er){
                                    throw new Error("Sorry! Something went wrong!");
                                });
                            }else{
                                return "Your order has been moved to next step! Continue your work!";
                            }
                        }, function (er) {
                            throw new Error("Updating failed!");
                        });
                    }
                }else{
                    throw new Error("Update failed!");
                }
            }, function () {
                throw new Error("Can't find this order!");
            });
        }
        else{
            throw new Error("Can't go to next step");
        }
    };

    /*
     * Create new Issue when shipper sned issue pending
     * @author: quyennv - 6/11
     */

    var createIssuePending = function (shipperID, issue, orders, categoryissue) {
        var issueType;
        var task = db.task;
        var listStores = [];
        if(_.isNull(shipperID) || _.isNull(issue) || _.isNull(orders) || _.isNull(categoryissue)) {
            throw new Error('NullException');
        }
        categoryissue = parseInt(categoryissue)?parseInt(categoryissue):0;
        if (categoryissue == 1 || categoryissue ==2) {
            //continue
        } else {
            throw new Error('NullException');
        }
        //Instance new Issue
        var newIssue = _.cloneDeep(issue);
        newIssue.isresolved = false;
        newIssue.resolvetype = null;
        newIssue.createddate = new Date();
        newIssue.sender =  shipperID;

        // Update haveIssue of shipper
        //console.log('shipperManage:352 newIssue', newIssue);
        if (newIssue.typeid != 4 && newIssue.typeid != 5)
            server.socket.updateIssueForShipper(shipperID, true);        

        return db.issue.createNewIssue(newIssue)
            .then(function(issue) {
                issueType = issue.dataValues.typeid;
                //UPDATE task status of task to 'Processing'
                //Case: Pending
                var newStatus = 4;
                if (categoryissue === 1) {
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
                    { room: shipperID },
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
                    //console.log('shipperController:446', admins);
                    // insert to notification
                    var promises = admins.map(function(e) {
                        var data = _.clone(msgToAdmin, true);
                        data.username = e.username;
                        //console.log('data', data);
                        return db.notification.addNotification(data);
                    });

                    return Promise.all(promises);
                })
                .then(function(data) {
                    //console.log('shipperController:458', data.length);
                    return db.order.getStoresOfOrder(orders);
                })
                .then(function (storeIDs) {
                    storeIDs = _.uniq(storeIDs, 'storeid');
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
                    //console.log('shipperController:473', ownerStores);

                    // insert to notification to store
                    var promises = ownerStores.map(function(e) {
                        var data = _.clone(msgToStore, true);
                        data.username = e.managerid;
                        //console.log('data', data);
                        return db.notification.addNotification(data);
                    });

                    return Promise.all(promises);

                })
                .then(function(data) {
                    //console.log('shipperController:480', data.length);
                    //console.log('send notification to store and admin');
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
                        //console.log("shipperMaanges:516", listStores);
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

                return group;

            }, function (err) {
                throw err;
            });
    };

    /*
     * Change is pending of order
     * @author: quyennv
     */
    var changeIsPending = function(shipperid, issueId) {
        var issueId = parseInt(issueId)? parseInt(issueId) : 0;
        var result;
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
            {"id": 3, "content": "You can continue"},
            {"id": 5, "content": "You can Continue"}
        ];
        return issue.changeIsPendingOfShipper(task, order, issuetype, orderissue, shipperid, issueId)
            .then(function(tasks){
                var listOrdersOfCurrentShip = [];
                var listOrdersAsignToOther = [];
                var deferred = Q.defer()
                if(_.isEmpty(tasks) == false) {

                    _.each(tasks, function(task){
                        //Issue of current task not resolved -> Waiting for Admin
                        if (task.isresolved == false) {
                            deferred.resolve(resMess[0]);
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
                        result = resMess[1];
                        deferred.resolve(resMess[1]);
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
                            //change isPending
                            db.order.changeIsPendingOrder(orderID, false);
                        });
                        //add new notification
                        db.order.getStoresOfOrder(listOrdersOfCurrentShip)
                        .then(function(storeIDs){
                            storeIDs = _.uniq(storeIDs, 'storeid');
                            storeIDs = storeIDs.map(function(e){
                                return e.storeid;
                            });
                            return db.managestore.getOwnerOfStore(storeIDs);
                            })
                        .then(function(ownerStores){
                            ownerStores = ownerStores.map(function(e) {
                                return e.toJSON();
                            });
                            //insert to notification
                            var promises = ownerStores.map(function(e) {
                                var data = _.clone(msgToStore, true);
                                data.username = e.managerid;
                                return db.notification.addNotification(data);
                            });
                            return Promise.all(promises);
                        })
                        .then(function (data) {
                            //console.log('send notification continue to store');
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
                            // server.socket.updateIssueForShipper(shipperid, false);

                            // Notify order canceled by Store
                            //console.log("ListOrderOfShipperWhenIssue+++++:688", listOrdersOfCurrentShip)
                            db.order.getManyOrder(listOrdersOfCurrentShip)
                            .then(function(orderIDs){
                                orderIDs = orderIDs.map(function(e) {
                                    return e.toJSON();
                                });
                                //console.log("listOrderCanceled+++++++: 694", orderIDs);
                                if (orderIDs.length > 0) {
                                    //res message continue, but some order canceled by store
                                    deferred.resolve(resMess[3]);
                                } else {
                                    //res mesage continue
                                    deferred.resolve(resMess[2]);
                                }
                            });
                        });
                    }

                    return deferred.promise;
                }
            }, function(err) {
                throw err;
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

    var getAllShipper = function() {
        return db.user.getAllUsersHasRole(1, db.profile, db.workingstatus)
            .then(function(shipper) {
                return shipper;
            }, function(err) {
                throw err;
            });
    };

    var getAllOrderToAssignTask = function () {
        var orderList=[];
        var promise=[];
        return db.order.getAllOrderToAssignTask(db.orderstatus, db.task, db.taskstatus)
            .then(function(listOrder) {
                listOrder.map(function(item) {
                    var add = item.getCustomerAddress();
                    item = item.toJSON();
                    item['deliveryaddress'] = add;
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
                });
                return orderList;
            }, function(err) {
               throw err;
            })
    };

    var getAllShipperWithTask = function () {
        var listReturn = [];
        return db.user.getAllShipperWithTask(db.task, db.profile, db.order, db.orderstatus, db.tasktype, db.taskstatus)
            .then(function(shipperList) {
                 shipperList.forEach(function (shipper) {
                     var listTask = [];
                     var shiperObj = {};
                    //console.log(shipper);
                   shipper['tasks'].forEach(function (task) {
                        var add = task.order.getCustomerAddress();
                        task = task.toJSON();
                        task['order']['deliveryaddress'] = add;
                       //console.log(task);
                       listTask.push(task)
                    });
                     shipper = shipper.toJSON();
                     shipper['tasks']= listTask;
                     //console.log(shipper.tasks[0].order);
                     //shiperObj = _.cloneDeep(shipper.toJSON());
                    //shipper['tasks'] = _.cloneDeep(rs);
                    listReturn.push(shipper);
                });
                return listReturn;
            }, function(err) {
                throw err;
            })
    };

    var getAllShipperWithTaskForProcessing = function (req, res, next) {
        var shipperid = req.params.shipperid;
        var listReturn = [];
        ////console.log(shipperid)
        return db.user.getAllTaskProcessingOfShipper(db.task, db.profile, db.order, db.orderstatus, db.tasktype, db.taskstatus, shipperid)
            .then(function(shipperList) {
                ////console.log("--------------Data Task Shipper -------------------");

                ////console.log(shipper);
                shipperList.forEach(function (shipper) {
                    var listTask = [];
                    var shiperObj = {};
                    //console.log(shipper);
                    shipper['tasks'].forEach(function (task) {
                        var add = task.order.getCustomerAddress();
                        task = task.toJSON();
                        task['order']['deliveryaddress'] = add;
                        ////console.log(task);
                        listTask.push(task)
                    });
                    shipper = shipper.toJSON();
                    shipper['tasks']= listTask;
                    ////console.log(shipper.tasks[0].order);
                    //shiperObj = _.cloneDeep(shipper.toJSON());
                    //shipper['tasks'] = _.cloneDeep(rs);
                    listReturn.push(shipper);
                });
                return listReturn;
            }, function(err) {
                next(err);
            }).then(function(listReturn){
                res.status(200).json(listReturn);
            })
    };

    var updateTaskForShipper = function (shipperList) {
        if (shipperList == null) throw new Error('Null Exception');
        shipperList.forEach(function(shipperTasks){
            if(shipperTasks.tasks) {
                shipperTasks.tasks.forEach(function(task){
                    if(task.statusid === 4){
                        server.socket.changeShipperOfOrder(shipperTasks.username, task.order.orderid);
                    }
                });
            }
        });

        var promise = [];

        shipperList.map(function (shipper) {
            shipper.tasks.map(function (task) {
                if (task.taskid == null) db.order.updateStockForOrder(task.order.orderid, 1);

                promise.push(db.task.assignTaskForShipper(task)
                    .then(function(newTask) {

                        //console.log(newTask)
                         return newTask
                        ////console.log(newTask.taskid)
                    }, function(err) {
                        throw err;
                    }));
            })

        });
        return Promise.all(promise);
    };

    //// START - Get status of shipper
    //// HuyTDH - 03-11-15
    var getShipperStatus = function(req, res, next){
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        var stt = server.socket.shippers[shipperid].isConnected;
        res.status(200).json({'status': stt});
    };
    //// END - Get status of shipper

    /*
    * Get all Task of Shipper tobe Issue
    * @author: quyennv
    */

    var getTaskBeIssuePending = function (shipperid) {
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

                return group;

            }, function(err) {
                throw err;
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
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        var data = _.cloneDeep(req.body);
        var status = data.status;
        server.socket.shippers[shipperid].isConnected = status;
        res.status(200).json("Change status successfully!");
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
    var createShipperID = function(){
        var isExisted = false;
        var promise;
        do
        {
            var str = "000000" + parseInt(Math.random()*1000000);
            var formatStr = str.substr(str.length - 6);
            var newShipperID = "SP" + formatStr;
            //console.log(newShipperID);
            promise = db.user.findUserByUsername(newShipperID)
                .then(function(shipper){
                    //console.log(newShipperID, shipper);
                    if(!shipper){
                        //console.log('AAA');
                        isExisted = true;
                        return newShipperID;
                    }
                },function(err){
                    throw err;
                });
        } while (isExisted);
        //console.log(data);
        return promise;
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
        getTasks: getTasks,
        getHistory: getHistory,
        getDetail: getDetail,
        paramOrderId: paramOrderId,
        getOrderStatusList: getOrderStatusList,
        nextStep: nextStep,
        createIssuePending: createIssuePending,
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
