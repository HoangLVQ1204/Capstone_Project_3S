/**
 * Created by Cao Khanh on 21/10/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var params = function (req, res, next, order_id) {
        var OrderStatus = db.orderstatus;
        return db.order.storeGetOneOrder(OrderStatus,order_id)
            .then(function (order) {
                if (order) {
                    req.orderRs = order;
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
        order.belongsTo(orderStatus, {
            foreignKey: {
                name: 'statusid'
            }
        });
        var storeid = 'str1';
        return order.storeGetAllOrders(orderStatus, storeid)
            .then(function (orders) {
                var listOrders = [];
                var statusname = '';
                var createDate = '';
                var doneDate ='';
                _.each(orders, function(order){
                    if(order['orderstatus'] == null){
                        statusname = '';
                    } else {
                        statusname = order['orderstatus'].dataValues.statusname;
                    }
                    if(order.dataValues.createdate == null){
                        createDate = '';
                    }else {
                        createDate = order.dataValues.createdate;
                    }
                    if(order.dataValues.donedate == null){
                        doneDate = '';
                    }else {
                        doneDate = order.dataValues.donedate;
                    }
                    listOrders.push({
                        'orderid': order.dataValues.orderid,
                        'statusname': statusname,
                        'deliveryaddress': order.dataValues.deliveryaddress,
                        'recipientname' : order.dataValues.recipientname,
                        'recipientphone' : order.dataValues.recipientphone,
                        'isdraff': order.dataValues.isdraff,
                        'iscancel':order.dataValues.iscancel,
                        'ispending': order.dataValues.ispending,
                        'cod': order.dataValues.cod,
                        'fee' : order.dataValues.fee,
                        'createdate' : createDate,
                        'donedate' : doneDate,

                    })
                });
                var totalCod =0;
                var totalFee = 0;
                var todayOrder =0;
                var todayCod = 0;
                var todayFee = 0;
                var group = {};
                group['Total'] = group['Total'] || [];
                group['Draff'] = group['Draff'] || [];
                group['Issue'] = group['Issue'] || [];
                group['Done'] = group['Done'] || [];
                group['Inprocess'] = group['Inprocess'] || [];
                _.each(listOrders, function(item) {
                    if(item['isdraff']) {
                        group['Draff'].push(item);
                    } else if(item['iscancel']) {
                        group['Issue'].push(item);
                    }else if(_.isEqual(item['statusname'],'Done')){
                        group['Done'].push(item);
                    } else{
                        group['Inprocess'].push(item);
                    }
                    if(!_.isEqual(item['createdate'],'')){
                        var date = new Date(item['createdate']);
                        date.setHours(0,0,0,0);
                        var today = new Date();
                        today.setHours(0,0,0,0);
                        if(date.valueOf() === today.valueOf())
                            todayOrder ++;
                    }

                    if(!_.isEqual(item['donedate'],'')){
                        var date = new Date(item['donedate']);
                        date.setHours(0,0,0,0);
                        var today = new Date();
                        today.setHours(0,0,0,0);
                        if(date.valueOf() === today.valueOf()){
                            todayCod = todayCod + parseInt(item.cod);
                            todayFee = todayFee + parseInt(item.fee);
                        }

                    }

                    totalCod = totalCod + parseInt(item.cod);
                    totalFee = totalFee + parseInt(item.fee);
                });

                group['Total'].push(totalCod);
                group['Total'].push(totalFee);
                group['Total'].push(todayOrder);
                group['Total'].push(todayCod);
                group['Total'].push(todayFee);

                res.status(200).json(group);
            }, function (err) {
                next(err);
            })
    };
    var getOne = function (req, res, next) {
        res.status(200).json(req.orderRs);

    };

    var post = function (req, res, next) {
        var newOrder = req.body;
        return db.order.postOneOrder(newOrder)
            .then(function (order) {
                res.status(201).json(order);
            }, function(err){
                next(err);
            })
    };

    var put = function (req, res, next) {
        var order = {};
        var update = req.body;

        order.orderid = update.orderid;
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
    };

    var deleteOrder = function (req, res, next) {
        req.orderRs = req.orderRs.toJSON();
        db.goods.deleteGood(req.orderRs.orderid);
        db.confirmationcode.deleteConfirmCode(req.orderRs.orderid);
            //.then(function(abc) {
            //    res.status(200);
            //}, function(err) {
            //    next(err);
            //});
        db.order.deleteDraffOrder(req.orderRs.orderid);
            //.then(function() {
            //    res.status(200);
            //}, function(err) {
            //    next(err);
            //});
    };

    var putDraff = function(req, res, next){
        console.log(req.body.orderid);
        db.order.submitDraffOrder(req.body.orderid)
            .then(function(){
                res.sendStatus(200);
            }, function(err) {
                next(err);
            });
    }


    return {
        getAllOrder: getAllOrder,
        getOne: getOne,
        postOne: post,
        params: params,
        put : put,
        deleteOrder : deleteOrder,
        putDraff : putDraff,
    }
}