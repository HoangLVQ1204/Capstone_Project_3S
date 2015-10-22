/**
 * Created by Cao Khanh on 21/10/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var params = function (req, res, next, order_id) {
        return db.order.getOneOrder(order_id)
            .then(function (order) {
                if (order) {
                    req.ss = order;
                    next();
                } else {
                    next(new Error('No order with id'));
                }

            }, function (err) {
                next(err);
            });
    };

    var getAllOrder = function (req, res, next) {
        var orderStatus = db.orderstatus;
        var order = db.order;
        var storeid = 'str1';
        return order.getAllOrders(orderStatus, storeid)
            .then(function (orders) {
                var listOrders = [];
                _.each(orders, function(order){
                    listOrders.push({
                        'orderid': order.dataValues.orderid,
                        'statusname': order.orderstatus.dataValues.statusname,
                        'deliveryaddress': order.dataValues.deliveryaddress,
                        'recipientname' : order.dataValues.recipientname,
                        'recipientphone' : order.dataValues.recipientphone
                    })
                });
                var group = {};
                group['Waiting'] = group['Waiting'] || [];
                group['Carrying'] = group['Carrying'] || [];
                _.each(listOrders, function(item) {
                    if(_.isEqual(item['statusname'], 'Waiting')) {
                        group['Waiting'].push(item);
                    } else if(_.isEqual(item['statusname'], 'Carrying')) {
                        group['Carrying'].push(item);
                    }
                });


                res.status(200).json(group);
            }, function (err) {
                next(err);
            })
    };
    var getOne = function (req, res, next) {
        res.status(200).json(req.ss);

    };

    var post = function (req, res, next) {
        var newOrder = req.body;
        return db.order.postOneOrder(newOrder)
            .then(function (order) {
                res.status(201).json(order);
            }, function(err){
                next(err);
            })
            ;    };

    var put = function (req, res, next) {
        var order = req.order;
        var update = req.body;

        order.storeid = update.storeid;
        order.ordertypeid = update.ordertypeid;
        order.pickupaddress = update.pickupaddress;
        order.deliveryaddress = update.deliveryaddress;
        order.pickupdate = update.pickupdate;
        order.deliverydate = update.deliverydate;
        order.recipientphone = update.recipientphone;
        order.recipientname = update.recipientname;

        return db.order.putOrder(order)
            .then(function(save){
                if(save){
                    res.status(201).json(order);
                }else {
                    next( new Error('Cannot save user'));
                }
            })
    }


    return {
        getAllOrder: getAllOrder,
        getOne: getOne,
        postOne: post,
        params: params,
        put : put
    }
}