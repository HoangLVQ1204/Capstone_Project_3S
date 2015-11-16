/**
 * Created by Cao Khanh on 21/10/2015.
 */
var _ = require('lodash');
var config = require('../config/config');

module.exports = function (app) {
    var db = app.get('models');

    var params = function (req, res, next, order_id) {
        var OrderStatus = db.orderstatus;
        var goods = db.goods;
        var confirmCode = db.confirmationcode;
        return db.order.storeGetOneOrder(OrderStatus,goods,confirmCode,order_id)
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

        var storeId = req.user.stores[0].storeid;
        //console.log("================storeId====================",storeId);
        var orderStatus = db.orderstatus;
        var order = db.order;
        var ordertype = db.ordertype;
        return order.storeGetAllOrders(orderStatus,ordertype, storeId)
            .then(function (orders) {
                var listOrders = [];
                var statusname = '';
                var createDate = '';
                var completedate ='';
                var ledgerid ='';
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
                    if(order.dataValues.completedate == null){
                        completedate = '';
                    }else {
                        completedate = order.dataValues.completedate;
                    }
                    if(order.dataValues.ledgerid == null){
                        ledgerid = '';
                    }else {
                        ledgerid = order.dataValues.ledgerid;
                    }
                    listOrders.push({
                        'orderid': order.dataValues.orderid,
                        'statusname': statusname,
                        'deliveryaddress': order.dataValues.deliveryaddress,
                        'recipientname' : order.dataValues.recipientname,
                        'recipientphone' : order.dataValues.recipientphone,
                        'isdraff': order.dataValues.isdraff,                        
                        'ispending': order.dataValues.ispending,
                        'cod': order.dataValues.cod,
                        'fee' : order.dataValues.fee,
                        'createdate' : createDate,
                        'completedate' : completedate,
                        'ordertype': order['ordertype'].dataValues.typename,
                        'ledgerid': ledgerid

                    })
                });
                var totalNewOrder = 0;
                var totalNewCod =0;
                var totalNewFee = 0;
                var todayOrder =0;
                var todayCod = 0;
                var todayFee = 0;
                var group = {};
                group['Total'] = group['Total'] || [];
                group['Draff'] = group['Draff'] || [];
                group['Done'] = group['Done'] || [];
                group['Inprocess'] = group['Inprocess'] || [];
                _.each(listOrders, function(item) {
                    if(item.ledgerid == ''){

                        if(item['isdraff']) {
                        group['Draff'].push(item);
                        }else if(_.isEqual(item['statusname'],'Done')|| _.isEqual(item['statusname'],'Canceled') ){
                            group['Done'].push(item);
                            totalNewCod = totalNewCod + parseInt(item.cod);
                            totalNewFee = totalNewFee + parseInt(item.fee);
                        }else {
                            group['Inprocess'].push(item);
                        }                        
                        totalNewOrder++;

                        if(!_.isEqual(item['createdate'],'' && !item['isdraff'])){
                        var date = new Date(item['createdate']);
                        date.setHours(0,0,0,0);
                        var today = new Date();
                        today.setHours(0,0,0,0);
                        if(date.valueOf() === today.valueOf())
                            todayOrder ++;
                    }

                    if(!_.isEqual(item['completedate'],'')){
                        var date = new Date(item['completedate']);
                        date.setHours(0,0,0,0);
                        var today = new Date();
                        today.setHours(0,0,0,0);
                        if(date.valueOf() === today.valueOf()){
                            todayCod = todayCod + parseInt(item.cod);
                            todayFee = todayFee + parseInt(item.fee);
                        }

                    }
                    }

                });

                group['Total'].push(totalNewCod);
                group['Total'].push(totalNewFee);
                group['Total'].push(todayOrder);
                group['Total'].push(todayCod);
                group['Total'].push(todayFee);
                group['Total'].push(totalNewOrder);

                res.status(200).json(group);
            }, function (err) {
                next(err);
            })
    };


    var getOne = function (req, res, next) {
        //var listOrders = [];
        //var statusname = '';
        //var deliveryaddress = '';
        //var recipientname = '';
        //var recipientphone = '';
        //var completedate = '';
        //var createdate = '';
        //var cod = 0;
        //var fee = 0;
        //console.log(req.orderRs['orderid']);
        //var order = {
        //    orderid : req.orderRs['orderid'],
        //    deliveryaddress : req.orderRs['deliveryaddress'],
        //    recipientname : req.orderRs['recipientname'],
        //    recipientphone : req.orderRs['recipientphone'],
        //    statusid : req.orderRs['statusid'],
        //    isdraff : req.orderRs['isdraff'],
        //    iscancel : req.orderRs['iscancel'],
        //    ispending : req.orderRs['ispending'],
        //    cod : req.orderRs['cod'],
        //    fee : req.orderRs['fee'],
        //    completedate : req.orderRs['completedate'],
        //    createdate : req.orderRs['createdate'],
        //    statusname : req.orderRs['orderstatus'].statusname
        //};
        //
        //var rs =  req.orderRs['goods'];
        //_.each(rs, function(item) {
        //    console.log(item.dataValues.goodsid);
        //});
        res.status(200).json(req.orderRs);
    };

    var post = function (req, res, next) {
        var newOrder = {};

        /*
         * By HuyTDH - 09/10/2015
         * This function is used to create ID for order       
         */
        var str = "000000" + parseInt(Math.random()*1000000);
        var formatStr = str.substr(str.length - 6);
        var newOrderID = "OD" + formatStr;
        newOrder.orderid = newOrderID;
        ////////

        /*
         * By KhanhKC - 14/11/2015
         * This function is used to caculate Ship fee       
         */
         var fee = 0;
         var district = req.body.selectedDistrict;
         var innerCity = config.fileterLocation.in;

         if(innerCity.indexOf(district)> -1){
            if(req.body.order.ordertypeid == '1'){
                fee = 10000;
            }else {
                fee = 20000;
            }                
        }else {
            if(req.body.order.ordertypeid == '1'){
                fee = 20000;
            }else {
                fee = 30000;
            }       
        }
        ///////

        /*
         * By KhanhKC - 14/11/2015
         * This function is used to caculate total weight of order       
        */
        var totalWeight = 0;
        for(var i = 0; i <req.body.goods.length;i++){
            totalWeight = totalWeight + req.body.goods[i].weight*req.body.goods[i].amount;
        }
        ///////

        /*
         * By KhanhKC - 14/11/2015
         * This function is used to caculate over weight fee of order       
        */
        var overWeightFee = 0;        
        if(totalWeight > 4000 ){
            console.log("===========totalWeight=======", totalWeight);
            if(innerCity.indexOf(district)> -1){
                overWeightFee = (totalWeight - 4000)*2*2;
                console.log("=============In=========",district);
            }else {
                overWeightFee = (totalWeight - 4000)*2*2.5;
                console.log("=============Out=========",district);
            }
            
        }
        ///////
        //console.log("=============fee===============",fee);        
        console.log("=============overWeightFee=======",overWeightFee);
        console.log("=============req.body===============",req.body);
        newOrder.storeid = req.body.order.storeid;
        newOrder.ordertypeid = req.body.order.ordertypeid;
        newOrder.pickupaddress = req.body.order.pickupaddress;
        newOrder.deliveryaddress = req.body.order.deliveryaddress;
        newOrder.recipientphone = req.body.order.recipientphone;
        newOrder.recipientname = req.body.order.recipientname;
        newOrder.statusid = req.body.order.statusid;
        newOrder.ispending = 'false';
        newOrder.isdraff = req.body.order.isdraff;        
        newOrder.createdate = new Date(); 
        newOrder.fee = fee; 
        newOrder.overweightfee = overWeightFee;
        newOrder.cod = parseInt(req.body.order.cod)?parseInt(req.body.order.cod):0;
        //console.log("==============11===============");
               
        var code1 = {
        'codecontent' : parseInt(req.body.order.gatheringCode),
        'typeid' : 2,
        'orderid' : newOrder.orderid        
       };
       var code2 = {
        'codecontent' : parseInt(req.body.order.deliverCode),
        'typeid' : 6,
        'orderid' : newOrder.orderid
       };       
       
       var code3 = {
        'codecontent' : parseInt(req.body.order.inStockCode),
        'typeid' : 3,
        'orderid' : newOrder.orderid
       };
       var code4 = {
        'codecontent' : parseInt(req.body.order.returnStoreCode),
        'typeid' : 5,
        'orderid' : newOrder.orderid
       };
       console.log("==========code===========",code1);
       //console.log("==============22==============");
        db.order.postOneOrder(newOrder)
            .then(function (order) {
                //return res.status(200).json(order);
                //console.log("==============33==============");
                db.confirmationcode.postOneCode(code1);
                db.confirmationcode.postOneCode(code2);
                db.confirmationcode.postOneCode(code3);
                db.confirmationcode.postOneCode(code4);
                //console.log("==============44==============");
                for(var i = 0; i < req.body.goods.length; i++){
                    var good = {};                    
                    good.orderid = newOrderID;
                    good.stockid = null;
                    good.goodsname = req.body.goods[i].goodsname;
                    good.description = req.body.goods[i].description;
                    good.weight = parseInt(req.body.goods[i].weight)?parseInt(req.body.goods[i].weight):0;
                    good.lengthsize = parseInt(req.body.goods[i].lengthsize)?parseInt(req.body.goods[i].lengthsize):0;
                    good.widthsize = parseInt(req.body.goods[i].widthsize)?parseInt(req.body.goods[i].widthsize):0;
                    good.heightsize = parseInt(req.body.goods[i].heightsize)?parseInt(req.body.goods[i].heightsize):0;
                    good.amount = parseInt(req.body.goods[i].amount)?parseInt(req.body.goods[i].amount):0;
                    
                    console.log("===========good=======",good);
                    db.goods.postOneGood(good).then(function(goodsObj){
                        
                    });
                    //console.log("==============55==============");
                }

                return res.status(200).json(order);

            });
            // .then(function (order) {
            //    // console.log("--- New Order ID ---");
            //    // console.log(order.orderid);
            //    res.status(201).json("OK");
            //}, function(err){
            //    next(err);
            //})
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
        var deleteGoods = db.goods.deleteGood(req.orderRs.orderid);
        var deleteCode = db.confirmationcode.deleteConfirmCode(req.orderRs.orderid);
        Promise.all([deleteCode,deleteGoods]).then(function(){
            db.order.deleteDraffOrder(req.orderRs.orderid)
                .then(function() {
                    res.status(200).json("DELETED!");
                }, function(err) {
                    next(new Error("Delete draft fail!"));
                });
        },function(){
            next(new Error("Delete draft fail!"));
        });
    };

    var putDraff = function(req, res, next){
        db.order.submitDraffOrder(req.body.orderid)
        .then(function(){
            res.sendStatus(200);
        }, function(err) {
            next(err);
        });
    };

    var cancelOrder = function (req, res, next) {
        db.order.cancelOrder( req.orderRs.orderid);
            //.then(function(){
            //    res.sendStatus(200).json();
            //}, function(err) {
            //    next(err);
            //});
    };

    var getOrderList = function (req, res, next) {
        db.order.getAllOrder(db.orderstatus, db.ordertype, db.store)
        .then(function(list){
            res.status(200).json(list);
        }, function(err) {
            next(err);
        });
    };


    return {
        getAllOrder: getAllOrder,
        getOne: getOne,
        postOne: post,
        params: params,
        put : put,
        deleteOrder : deleteOrder,
        putDraff : putDraff,
        cancelOrder: cancelOrder,
        getOrderList: getOrderList
    }
}