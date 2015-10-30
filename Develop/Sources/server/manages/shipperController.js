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
                            'tasktype': task['tasks'][0].dataValues.tasktype,
                            'taskstatus': task['tasks'][0].dataValues.taskstatus,
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
                        if (_.isEqual(item['tasktype'], 1)) {
                            group['Pickup'].push(item);
                        } else if (_.isEqual(item['tasktype'], 2)) {
                            group['Ship'].push(item);
                        } else if (_.isEqual(item['tasktype'], 3)) {
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
        var OrderStatus = db.orderstatus;
        var rs = configConstant.expressStatusList;
        return res.status(200).json(rs);
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
                            if(codeObj){
                                orderObj.update({
                                    statusid: nextStatus
                                }).then(function (rs) {
                                    return res.status(200).json("Update successfully!");
                                }, function (er) {
                                    return res.status(400).json("Update failed!");
                                });
                            }else{
                                return res.status(400).json("Wrong Code!");
                            }
                        }, function(err){
                            return res.status(400).json("Wrong Code!");
                        });
                    }else{
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
        newIssue.category = req.body.category.categoryID;
        newIssue.content = req.body.content;
        db.issue.createNewIssue(newIssue)
            .then(function(issue) {
            }).then(function(){
                //Instance new list Order get an issued
                var listOrders = [];
                _.each(req.body.issuedOrder, function(order){
                    listOrders.push(order.val);
                });
                db.order.changeIsPendingOrder(listOrders);
                res.sendStatus(200);
            }, function(err) {
                next(err);
            });
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
        return db.order.getAllOrderToAssignTask(db.orderstatus)
            .then(function(shipper) {
                res.status(200).json(shipper);
            }, function(err) {
                next(err);
            })

    }

    var getAllShipperWithTask = function (req, res, next) {
        var shipperList;
        return db.user.getAllShipperWithTask(db.task, db.profile, db.order, db.orderstatus)
            .then(function(shipper) {
                res.status(200).json(shipper);
            }, function(err) {
                next(err);
            })
    }

    var getOrderOfList = function (req, res, next) {
        var orderidList = req.body;
        var orderList = [];
        console.log(req.body);
        return orderidList.map(function(orderid) {
            db.user.getAllShipperWithTask(orderid)
                .then(function (order) {
                    orderList.push(order);
                }, function (err) {
                    next(err);
                })
        }).then(function () {
            res.status(200).json(orderList);
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
        getAllShipper: getAllShipper,
        getAllOrderToAssignTask: getAllOrderToAssignTask,
        getAllShipperWithTask: getAllShipperWithTask,
        getOrderOfList: getOrderOfList

    }

}
