/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');
var configConstant = require('../config/configConstant');
var server = require('../server');

module.exports = function (app) {

    var db = app.get('models');

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
        var shipper = _.cloneDeep(req.user);
        var shipperid = shipper.username;
        Order.getOrderDetailById(detailtaskid, shipperid, OrderStatus, Goods, Task)
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
                        type: 'Info',
                        title: 'Shipper changed order status',
                        content: shipperid + ' changed status of order ' + orderObj.orderid,
                        url: '#/store/dashboard',
                        isread: false,
                        username: orderObj.storeid,
                        createddate: new Date()
                    };

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
                    var completeDate = (nextStatus == 7)? new Date(): orderObj.completedate;
                    if (isRequireCode) {
                        db.confirmationcode.checkCode(key, data.confirmcode, orderObj.statusid)
                            .then(function (codeObj) {
                            if (codeObj) {
                                orderObj.updateOrderStatus(nextStatus, completeDate)
                                    .then(function (rs) {
                                    if(oldStatus == pickUpStatusID){
                                        db.profile.getProfileUser(shipperid).then(function(profile){
                                            msg['profile'] = profile;
                                            msg['order'] = orderObj.orderid;
                                            server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
                                        });
                                    }else {
                                        server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
                                    }
                                    db.managestore.getUsersByStoreID(orderObj.storeid).then(function(rs){
                                        var manager = '';
                                        if(rs.length>0) manager = rs[0].dataValues.manager;
                                        msg['username'] = manager;
                                        db.notification.addNotification(msg);
                                    });
                                    if(oldStatus == taskBegin.statusid){
                                        Task.updateTaskStatus(nextStatus, taskid, shipperid).then(function (ok) {
                                            //addStoreToShipperRoom(orderObj.storeid, shipperid);
                                            //addOrderIntoSocket(orderObj.orderid, orderObj.storeid, shipperid);
                                            server.socket.startTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                            return res.status(200).json("Your task was active!");
                                        },function(er){
                                            return res.status(400).json("Sorry! Something went wrong!");
                                        });
                                    }else if(nextStatus == taskDone.statusid){
                                        Task.updateTaskStatus(nextStatus,taskid,shipperid).then(function(ok){
                                            //removeStoreFromShipperRoom(orderObj.storeid, shipperid);
                                            //removeOrderInSocket(orderObj.orderid);
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
                        orderObj.updateOrderStatus(nextStatus, completeDate)
                            .then(function (rs) {
                            server.socket.forward('server', receiver, msg, 'shipper:change:order:status');
                            db.managestore.getUsersByStoreID(orderObj.storeid).then(function(rs){
                                var manager = '';
                                if(rs.length>0) manager = rs[0].dataValues.manager;
                                msg['username'] = manager;
                                db.notification.addNotification(msg);
                            });
                            if(oldStatus == taskBegin.statusid){
                                Task.updateTaskStatus(nextStatus,taskid,shipperid).then(function(ok){
                                    //addStoreToShipperRoom(orderObj.storeid, shipperid);
                                    //addOrderIntoSocket(orderObj.orderid, orderObj.storeid, shipperid);
                                    server.socket.startTask(orderObj.orderid, orderObj.storeid, shipperid, customer);
                                    return res.status(200).json("Your task was active!");
                                },function(er){
                                    return res.status(400).json("Sorry! Something went wrong!");
                                });
                            }else if(nextStatus == taskDone.statusid){
                                Task.updateTaskStatus(nextStatus,taskid,shipperid).then(function(ok){
                                    //removeStoreFromShipperRoom(orderObj.storeid, shipperid);
                                    //removeOrderInSocket(orderObj.orderid);
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

    var nextStepCode = function (req, res, next) {
        return res.status(200).json('Test');
    };

    /*
     * create Issue @quyennv
     */
    var createIssue = function (req, res, next) {
        //Instance new Issue
        var newIssue = _.cloneDeep(req.body[0].issue);
        newIssue.isresolved = false;
        newIssue.resolvetype = null;
        newIssue.createddate = new Date();
        var orders = _.cloneDeep(req.body[0].orders);
        var categoryissue = _.cloneDeep(req.body[0].categoryissue);
        db.issue.createNewIssue(newIssue)
            .then(function(issue) {
                //Insert into orderissue
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
                var group = [];
                group.push({
                    'issueid': issue.dataValues.issueid,
                    'catissue': categoryissue
                });
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
                var listOrders = [];
                var listOrdersFail = [];
                if(_.isEmpty(tasks) == false) {
                    _.each(tasks, function(task){
                        //Issue of current task not resolved -> Waiting for Admin
                        if (task.isresolved == false) {
                            //console.log(resMess[0]);
                            res.status(200).json(resMess[0]);
                        } else {
                            _.each(task['orderissues'], function(item) {
                                //If admin assign task for another shipper
                                if (item.order['tasks'][0].statusid == 4) {
                                    listOrdersFail.push(item.orderid);
                                } else {
                                    //status of task = 2
                                    listOrders.push(item.orderid);
                                }
                            })
                        }
                    });
                    //console.log('quyen1', listOrdersFail);
                    if (listOrdersFail.length > 0) {
                        _.each(listOrdersFail, function(orderID) {
                            //Change isPending
                            db.order.changeIsPendingOrder(orderID, false);
                        });
                        res.status(200).json(resMess[1]);
                    }
                    //console.log('quyen2', listOrders);
                    if (listOrders.length > 0) {
                        //change isPending of Order
                        _.each(listOrders, function(orderID) {
                            //Change isPending
                            db.order.changeIsPendingOrder(orderID, false);
                        });
                        res.status(200).json(resMess[2]);
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
                        if (item.statusid == 4 && item.tasks.length==1) {
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
        var shipperList;
        return db.user.getAllShipperWithTask(db.task, db.profile, db.order, db.orderstatus, db.tasktype, db.taskstatus)
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
        //var shipperid = 'huykool';
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
                        if(_.isEmpty(task['orderissues']) == false) {
                            group[task['orderissues'][0].issueid] = group[task['orderissues'][0].issueid] || [];
                            group[task['orderissues'][0].issueid].push({
                                'orderid': task.orderid,
                                'ispending': task.ispending,
                                'isresolved': task['orderissues'][0].issue.isresolved,
                                'taskid': task['tasks'][0].taskid
                            });
                        }
                    });
                }
                res.status(200).json(group);
            }, function(err) {
                next(err);
            })
    }

    /*
     * Get all Task of Shipper is cancel @quyennv
     */
    var getAllTaskCancel = function(req, res, next) {
        //var shipperid = 'huykool';
        //console.log('quyen', req.user.username);
        var shipperid = req.user.username;
        var order = db.order;
        var task = db.task;
        var issue = db.issue;
        var issuetype = db.issuetype;
        var orderissue = db.orderissue;
        order.hasMany(orderissue, {
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
        return order.getAllTaskCancel(task, issue, issuetype, orderissue, shipperid)
            .then(function (tasks) {
                var listTasks = [];
                if(_.isEmpty(tasks) == false) {
                    _.each(tasks, function(task){
                        listTasks.push(task['tasks'][0].taskid);
                    })
                }
                res.status(200).json(listTasks);
            }, function (err) {
                next(err);
            })
    }

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
        //var storeid = 'STR001';
        //var storeid2 = 'STR003';
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

    //function add new Shipper to system
    var addNewUser = function(req, res, next){
        var user = req.body;
            db.user.addNewUser(user.account)
                .then(function(){
                    db.profile.addNewProfile(user.profile)
                        .then(function(profile){
                            res.status(201).json(profile);
                        },function(err){
                            //console.log(newShipperID, shipper);
                            res.status(400).json("Can not add new profile");
                        });
                },function(err){
                    //console.log(newShipperID, shipper);
                    res.status(400).json("Can not add new user");
                });

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

    //// END AREA OF PRIVATE FUNCTION



    return {
        getTask: getTask,
        getHistory: getHistory,
        getDetail: getDetail,
        paramOrderId: paramOrderId,
        getOrderStatusList: getOrderStatusList,
        nextStep: nextStep,
        nextStepCode: nextStepCode,
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
        getAllTaskCancel: getAllTaskCancel,
        testSk: testSk,
        createShipperID: createShipperID,
        addNewUser: addNewUser

    }
}
