/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');
var configConstant = require('../config/configConstant');

module.exports = function (app) {

    var db = app.get('models');

    var getTask = function (req, res, next) {
        var shipperid = 'huykool';
        var taskdate = '2015-02-15';
        var Task = db.task;
        var Order = db.order;

        return Order.getAllTaskOfShipper(Task, shipperid, taskdate)
            .then(function (tasks) {
                var group = {};
                if (_.isEmpty(tasks) == false) {
                    var listTasks = [];
                    _.each(tasks, function(task){
                        listTasks.push({
                            'orderid': task.dataValues.orderid,
                            'typeid': task['tasks'][0].dataValues.typeid,
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
        //var shipperid = req.userid;
        var shipperid = 'huykool';
        var History = db.task;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        Order.belongsTo(OrderStatus, {
            foreignKey: 'statusid',
            constraints: false
        });
        History.belongsTo(Order, {
            foreignKey: 'orderid',
            constraints: false
        });
        History.getAllHistoryOfShipper(shipperid, Order, OrderStatus)
            .then(function (history) {
                var listHistory = [];
                history.map(function (order) {
                    order = order.toJSON();
                    listHistory.push({
                        'id': order.id,
                        'date': new Date(order.date),
                        'code': order.order.code,
                        'statusid': order.order.orderstatus.statusid,
                        'fee': order.order.fee,
                        'COD': order.order.cod
                    });
                });
                return res.status(200).json(listHistory);
            }, function (err) {
                next(err);
            })
    };

    var paramOrderId = function (req, res, next, orderid) {
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var Goods = db.goods;
        //Order.belongsTo(OrderStatus, {
        //    foreignKey: 'statusid',
        //    constraints: false
        //});
        //Order.hasMany(Goods, {
        //    foreignKey: 'orderid',
        //    constraints: false
        //});
        Order.getOrderDetailById(OrderStatus, Goods, orderid)
            .then(function (rs) {
                if (rs) {
                    rs = rs.toJSON();
                    var detail = {
                        code: rs.orderid,
                        statusid: rs.statusid,
                        storeid: rs.storeid,
                        ordertypeid: rs.ordertypeid,
                        pickupaddress: rs.pickupaddress,
                        deliveryaddress: rs.deliveryaddress,
                        pickupdate: rs.pickupdate,
                        deliverydate: rs.deliverydate,
                        recipientphone: rs.recipientphone,
                        recipientname: rs.recipientname,
                        fee: rs.fee,
                        cod: rs.cod,
                        pickupaddresscoordination: rs.pickupaddresscoordination.split(','),
                        deliveryaddresscoordination: rs.deliveryaddresscoordination.split(','),
                        status: rs.orderstatus.status, // No need to get status name
                        //stockid: 1, // Need to get stock info (join with stock)
                        weight: rs.goods[0].weight,
                        lengthsize: rs.goods[0].lengthsize,
                        widthsize: rs.goods[0].widthsize,
                        heightsize: rs.goods[0].heightsize,
                        description: rs.goods[0].description
                    };
                    req.detail = detail;
                    next();
                } else {
                    next(new Error('No order with id' + orderid));
                }
            }, function (err) {
                next(err);
            });
    };

    var getDetail = function (req, res, next) {
        return res.status(200).json(req.detail);
    };

    var getExpressStatusList = function (req, res, next) {
        var rs = configConstant.expressStatusList;
        return res.status(200).json(rs);

        //// START TEST % DUPLICATE
        //var list = [];
        //var sample = 1*500;
        //var len = 10*1000;
        //for(var i = 0;  i < sample; i++){
        //    var d = Math.random();
        //    list.push(parseInt(d*len));
        //}
        //list.sort();
        //var count = 0;
        //for(var i = 0;  i < list.length - 1; i++){
        //    if(list[i]==list[i+1]) count++;
        //}
        //rs = "SH" + parseFloat(count*100/sample);
        //return res.status(200).json(100*count/sample+" % duplicate");
        //// END TEST % DUPLICATE

    };

    var nextStep = function (req, res, next) {
        var Order = db.order;
        var data = _.cloneDeep(req.body);
        if (data) {
            var key = data.code;
            Order.findOne({where: {orderid: key}}).then(function (orderObj) {
                if (orderObj) {
                    var nextStatus = 0;
                    var isRequireCode = false;
                    // Need to check is canceled
                    // Need to check is canceled
                    // Need to check is canceled
                    // Need to check is canceled
                    // Need to check is canceled
                    var statusList = (orderObj.ordertypeid == configConstant.orderType.EXPRESS_TYPE) ? configConstant.expressStatusList : configConstant.normalStatusList;
                    for (var i = 0; i < statusList.length; i++) {
                        st = statusList[i];
                        if (orderObj.statusid < st.statusid) {
                            nextStatus = st.statusid;
                            break;
                        } else {
                            nextStatus = st.statusid;
                            isRequireCode = st.requiredcode;
                        }
                    }
                    if (isRequireCode) {
                        db.confirmationcode.findOne({
                            where: {
                                orderid: key,
                                codecontent: data.confirmcode,
                                typeid: orderObj.statusid
                            }
                        }).then(function (codeObj) {
                            if (codeObj) {
                                orderObj.update({
                                    statusid: nextStatus
                                }).then(function (rs) {
                                    return res.status(200).json("Update successfully!");
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
                        orderObj.update({
                            statusid: nextStatus
                        }).then(function (rs) {
                            return res.status(200).json("Update successfully!");
                        }, function (er) {
                            return res.status(400).json("Update failed!");
                        });
                    }
                }
            }, function () {
                return res.status(400).json("Can't find this order!");
            });
        }
    };

    var nextStepCode = function (req, res, next) {
        return res.status(200).json('Test');
    };

    var createIssue = function (req, res, next) {
        //Instance new Issue
        var newIssue = {};
        newIssue.categoryID = req.body.category.categoryID;
        newIssue.reason = req.body.reason.reasonName;
        newIssue.description = req.body.description;
        db.issue.createNewIssue(newIssue)
            .then(function(issue) {
                //Instance new list Order get an issued
                var listOrders = [];
                _.each(req.body.issuedOrder, function (order) {
                    listOrders.push(order.val);
                });
                //Insert into orderissue
                var newOrderIssue = {};
                newOrderIssue.issueid = issue.issueid;
                newOrderIssue.date = new Date();
                _.each(listOrders, function(orderID) {
                    newOrderIssue.orderid = orderID;
                    db.orderissue.createOrderIssue(newOrderIssue);
                    //Change isPending
                    db.order.changeIsPendingOrder(orderID);
                })
                res.sendStatus(200);
            }, function (err) {
                next(err);
            });
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
        return db.user.getAllUsersHasRole(1, db.profile)
            .then(function(shipper) {
                res.status(200).json(shipper);
            }, function(err) {
                next(err);
            })
    };

    var  getAllOrderToAssignTask = function (req, res, next) {
        var orderList=[];
        var promise=[];
        return db.order.getAllOrderToAssignTask(db.orderstatus, db.task)
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
    }




    return {
        getTask: getTask,
        getHistory: getHistory,
        getDetail: getDetail,
        paramOrderId: paramOrderId,
        getExpressStatusList: getExpressStatusList,
        nextStep: nextStep,
        nextStepCode: nextStepCode,
        createIssue: createIssue,
        paramMapdata: paramMapdata,
        getMapData: getMapdata,
        getAllShipper: getAllShipper,
        getAllOrderToAssignTask: getAllOrderToAssignTask,
        getAllShipperWithTask: getAllShipperWithTask,
        updateTaskForShipper: updateTaskForShipper

    }

}
