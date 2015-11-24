/**
 * Created by Cao Khanh on 21/10/2015.
 */
 var _ = require('lodash');
 var config = require('../config/config');

 module.exports = function (app) {
    var db = app.get('models');
    var server = app.get('io');

    var params = function (req, res, next, orderid) {
        var OrderStatus = db.orderstatus;
        var goods = db.goods;
        var confirmCode = db.confirmationcode;
        return db.order.storeGetOneOrder(OrderStatus,goods,confirmCode,orderid)
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
        console.log("================storeId====================",storeId);
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
                var fullDeliveryAddress = order.getCustomerAddress();
                console.log("====================",fullDeliveryAddress);          
                listOrders.push({
                    'orderid': order.dataValues.orderid,
                    'statusname': statusname,
                    'recipientname' : order.dataValues.recipientname,
                    'recipientphone' : order.dataValues.recipientphone,
                    'isdraff': order.dataValues.isdraff,                        
                    'ispending': order.dataValues.ispending,
                    'cod': order.dataValues.cod,
                    'fee' : order.dataValues.fee,
                    'createdate' : createDate,
                    'completedate' : completedate,
                    'ordertype': order['ordertype'].dataValues.typename,
                    'ledgerid': ledgerid,
                    'fullDeliveryAddress': fullDeliveryAddress

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
                    }else if(_.isEqual(item['statusname'],'Done')|| _.isEqual(item['statusname'],'Cancel') ){
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
    res.status(200).json(req.orderRs);
};

var calculateShipFee = function(district, innerCity,ordertypeid){
    if(innerCity.indexOf(district)> -1){
        if(ordertypeid == '1'){
            fee = 10000;
        }else {
            fee = 20000;
        }                
    }else {
        if(ordertypeid == '1'){
            fee = 20000;
        }else {
            fee = 30000;
        }       
    }
    return fee;
}; 
    /*
         * By KhanhKC - 14/11/2015
         * This function is used to caculate over weight fee of order       
         */
         var calculateOverWeightFee = function (district, innerCity, listgoods){
            var totalWeight = 0;
            var overWeightFee = 0;
            for(var i = 0; i <listgoods.length;i++){
                totalWeight = totalWeight + listgoods[i].weight*listgoods[i].amount;
            }                  
            if(totalWeight > 4000 ){
            //console.log("===========totalWeight=======", totalWeight);
            if(innerCity.indexOf(district)> -1){
                overWeightFee = (totalWeight - 4000)*2*2;
                //console.log("=============In=========",district);
            }else {
                overWeightFee = (totalWeight - 4000)*2*2.5;
                //console.log("=============Out=========",district);
            }
            
        }
        return overWeightFee;
    }
    var GenerateRandomCode = function(length){
        var code = "";
        var chars = "123456789";
        for( var i=0; i < length; i++ )
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    }
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
        

        /*
         * By KhanhKC - 14/11/2015
         * This function is used to calculate Shipping fee
         */
         
         var district = req.body.order.deliverydistrictid;
         var innerCity = config.fileterLocation.in;
         var ordertypeid = req.body.order.ordertypeid;
         var fee = calculateShipFee (district, innerCity,ordertypeid);         
         var overWeightFee = calculateOverWeightFee (district, innerCity,req.body.goods)
        
        //console.log("=============fee===============",fee);        
        //console.log("=============overWeightFee=======",overWeightFee);
        //console.log("=============req.body===============",req.body);
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
        newOrder.deliveryprovinceid = req.body.order.deliveryprovinceid;
        newOrder.deliverydistrictid = req.body.order.deliverydistrictid;
        newOrder.deliverywardid = req.body.order.deliverywardid;
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
            'codecontent' : GenerateRandomCode(6),
            'typeid' : 3,
            'orderid' : newOrder.orderid
        };        
        var code4 = {
            'codecontent' : GenerateRandomCode(6),
            'typeid' : 5,
            'orderid' : newOrder.orderid
        };
        // var code5 = {
        //     'codecontent' : GenerateRandomCode(6),
        //     'typeid' : 5,
        //     'orderid' : newOrder.orderid
        // };
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
                    if(!_.isNumber(parseInt(req.body.goods[i].weight))){
                        good.weight = 0;
                    } else {
                        good.weight = parseInt(req.body.goods[i].weight);
                    }

                    if(!_.isNumber(parseInt(req.body.goods[i].lengthsize))){
                        good.lengthsize = 0;
                    } else {
                        good.lengthsize = parseInt(req.body.goods[i].lengthsize);
                    }

                    if(!_.isNumber(parseInt(req.body.goods[i].widthsize))){
                        good.widthsize = 0;
                    } else {
                        good.widthsize = parseInt(req.body.goods[i].widthsize);
                    }

                    if(!_.isNumber(parseInt(req.body.goods[i].heightsize))){
                        good.heightsize = 0;
                    } else {
                        good.heightsize = parseInt(req.body.goods[i].heightsize);
                    }

                    if(!_.isNumber(parseInt(req.body.goods[i].amount))){
                        good.amount = 0;
                    } else {
                        good.amount = parseInt(req.body.goods[i].amount);
                    }                    
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



var updateOrder = function (req, res, next) {
    var district = req.body.selectedDistrict;
    var innerCity = config.fileterLocation.in;
    var order = {}; 
    var updateOrder = req.body.order;
    var listupdateGoods = req.body.listgoods;
    var clStoreid = req.user.stores[0].storeid;        
    order.ordertypeid = updateOrder.ordertypeid;
    order.recipientname = updateOrder.recipientname;
    order.recipientphone = updateOrder.recipientphone;
    order.deliveryaddress = updateOrder.deliveryaddress;
    order.deliveryprovinceid = updateOrder.deliveryprovinceid;
    order.deliverydistrictid = updateOrder.deliverydistrictid;
    order.deliverywardid = updateOrder.deliverywardid;
    order.ordertypeid = updateOrder.ordertypeid;
    order.fee = calculateShipFee (district, innerCity,updateOrder.ordertypeid);
    order.overweightfee = calculateOverWeightFee (district, innerCity, listupdateGoods);
    db.order.getOneOrder(updateOrder.orderid)
    .then(function(orderRs){
        if(orderRs.storeid == clStoreid){
            for(var i =0; i <listupdateGoods.length;i++){
                var updateGoods = listupdateGoods[i];
                var newGoods = {
                    goodsname: updateGoods.goodsname,
                    weight: updateGoods.weight,
                    lengthsize: updateGoods.lengthsize,
                    widthsize: updateGoods.widthsize,
                    heightsize: updateGoods.heightsize,
                    description: updateGoods.description
                }
                db.goods.updateGoods(newGoods,updateGoods.goodsid)                        
            }
            db.order.updateOrder(order,updateOrder.orderid)
            .then(function(rs){                            
                if(rs){
                    res.status(201).json(order);
                }else {
                    next( new Error('Cannot save user'));
                }
            })
        }else {
            next(err);
        }
    })
};

 var updateExpressOrder = function (req, res, next) {
     var order = req.body.order;
     console.log(order);
     return db.order.updateExpressOrder({
         statusid : order.statusId,
         isdraff: order.isDraff
     },order.orderId)
         .then(function (rs) {
             console.log(rs);
             res.status(201).json(rs);
         }, function (err) {
             next(err);
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
    console.log("=======cancerOrderId======", req.body.orderid);
    var ownerStoreUser = req.user.username;
    var storeID = req.user.stores[0].storeid;

    var issueCancel = {
        typeid: 7,
        description: 'Store ' + storeID +  ' request cancel',
        isresolved: false,
        resolvetype: null,
        createddate: new Date(),
        sender: ownerStoreUser
    };
    console.log("STRID:419", storeID);
    //Add new issue
    db.issue.createNewIssue(issueCancel)
    .then(function(issue){
        //Add notification
        var msgRequestCancel = {
            type: 'Info',
            title: 'Info',
            content: 'Store ' + storeID + ' requested cancel an order',
            url: '#/admin/issueBox/content?issueid=' + issue.dataValues.issueid,
            isread: false,
            createddate: new Date()
        };

        //get Admin
        db.user.getUserByRole(3)
        .then(function(admins){
            admins = admins.map(function(e) {
                return e.toJSON();
            });
            //insert notification to admin
            var promises = admins.map(function(e){
                var newData = _.clone(msgRequestCancel, true);
                newData.username = e.username;
                return db.notification.addNotification(newData);
            });

            return Promise.all(promises);
        })
        .then(function(data){
            console.log('orderManage:449', data.length);
            console.log('send notification disconnect to store and admin');
            //send socket
            var sender = {
                type: 'store',
                clientID: storeID
            };
            server.socket.forward(
                sender,
                'admin',
                msgRequestCancel,
                'admin::issue:cancelorder'
            );
        })
    }, function(err){
        next(err);
    })
};

var getOrderList = function (req, res, next) {
    db.order.getAllOrder(db.orderstatus, db.ordertype, db.store)
    .then(function(list){
        res.status(200).json(list);
    }, function(err) {
        next(err);
    });
};

var getTodayTotal = function (req, res, next) {
    var total = new Object();
    db.order.getTodayTotalDelivery()
    .then(function(fee){
        db.order.getTodayTotalCoD()
        .then(function(cod){
            total['fee'] = fee;
            total['cod'] = cod;
            res.status(200).json(total);
        }, function(err) {
            next(err);
        })
    }, function(err) {
        next(err);
    });
};

deleteGoods =  function(req, res, next){
    var goodsid = req.query.goodsid;
    var storeid = req.user.stores[0].storeid;
    db.goods.checkGoodsBelongStore(goodsid, storeid, db.order).then(function(goods){
        db.goods.deleteGoodsByID(goodsid).then(function(){
            return res.status(200).json("Delete goods successfully!");
        },function(){
            return res.status(400).json("Delete goods fail!");
        })
    },function(er){
        return res.status(400).json("Delete goods fail!");
    })
};

addGoods = function(req, res, next){
    var newGoods = req.body;
        //console.log("=============req.body==============",newGoods);
        db.goods.postOneGood(newGoods)
        .then(function(rs){
            console.log("============rs===============",rs.goodsid);
            return res.status(200).json(rs.goodsid);

        }, function(){
            return res.status(400).json("Add goods fail!");
        })
    };
    updateGoods = function(req, res, next){
        var goodsid = req.query.goodsid;
        var storeid = req.user.stores[0].storeid;
        var updateGoods = req.body;
        console.log("=============req.body==============",updateGoods);
        var newGoods = {
            goodsname: updateGoods.goodsname,
            weight: updateGoods.weight,
            lengthsize: updateGoods.lengthsize,
            widthsize: updateGoods.widthsize,
            heightsize: updateGoods.heightsize,
            description: updateGoods.description
        }
        db.goods.checkGoodsBelongStore(goodsid, storeid, db.order).then(function(goods){
            db.goods.updateGoods(newGoods,updateGoods.goodsid)       
            .then(function(){                
                return res.status(200).json("Update goods successfully!");
            }, function(){
                return res.status(400).json("Add goods fail!");
            })
        },function(er){
            return res.status(400).json("Delete goods fail!");
        })
        
    };
 
    var storeGetOrderList = function (req, res, next) {
        var storeId = req.user.stores[0].storeid;
        var orderStatus = db.orderstatus;
        var listOrder=[];
        db.order.storeGetAllOrders(db.orderstatus, db.ordertype,storeId)
        .then(function(list){

            var tempList = list.map(function(order){
                return order.toJSON();
            });

            tempList = tempList.map(function(order, index) {
                order.fullDeliveryAddress = list[index].getCustomerAddress(); 
                return order;    
            });

            res.status(200).json(tempList);
        }, function(err) {
            next(err);
        });
    };

    var countOrder = function (req, res, next){
        console.log("==========,stoerid=========",req.query.storeid);
        console.log("==========,year=========",req.query.year);
        var storeid = req.query.storeid;

        db.order.countOrder(storeid)
            .then(function(listRs){
                res.status(200).json(listRs);
            },function(err){
                next(err);
            })
    }
    

    return {
        getAllOrder: getAllOrder,
        getOne: getOne,
        postOne: post,
        params: params,
        updateExpressOrder : updateExpressOrder,
        updateOrder : updateOrder,
        deleteOrder : deleteOrder,
        putDraff : putDraff,
        cancelOrder: cancelOrder,
        getOrderList: getOrderList,
        getTodayTotal: getTodayTotal,
        deleteGoods: deleteGoods,
        addGoods: addGoods,
        updateGoods : updateGoods,
        storeGetOrderList : storeGetOrderList,
        countOrder : countOrder
    }
}