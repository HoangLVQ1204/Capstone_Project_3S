/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');

module.exports = function (app) {

    var db = app.get('models');

    var get = function (req, res, next) {
        var shipperid = 'hoang';
        var taskdate = '2015-02-09';
        var Task = db.task;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        //get all task of shipper
        Order.hasMany(Task, {
            foreignKey: 'orderid',
            constraints: false
        });
        //get status name of order
        Order.belongsTo(OrderStatus, {
            foreignKey: 'statusid',
            constraints: false
        });

        return Order.getAllTaskOfShipper(Task, OrderStatus, shipperid, taskdate)
            .then(function (tasks) {
                res.status(200).json(tasks);
            }, function (err) {
                next(err);
            })
    };

    var getHistory = function (req, res, next) {
        //var shipperid = req.userid;
        var shipperid = 'hoang';
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
        Order.belongsTo(OrderStatus, {
            foreignKey: 'statusid',
            constraints: false
        });
        Order.hasMany(Goods, {
            foreignKey: 'orderid',
            constraints: false
        });
        Order.getOrderDetailById(OrderStatus, Goods, orderid)
            .then(function (rs) {
                if (rs) {
                    rs = rs.toJSON();
                    var detail = {
                        code: rs.orderid,
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
                        status: rs.orderstatus.status,
                        //stockid: 1,
                        weight: rs.goods[0].weight,
                        lengthsize: rs.goods[0].lengthsize,
                        widthsize: rs.goods[0].widthsize,
                        heightsize: rs.goods[0].heightsize,
                        description: rs.goods[0].description
                    };
                    console.log(rs);
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
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        var Goods = db.goods;
        return res.status(200).json(req.detail);
    };

    return {
        get: get,
        getHistory: getHistory,
        getDetail: getDetail,
        paramOrderId: paramOrderId
    }

}
