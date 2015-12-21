/**
 * Created by Cao Khanh on 21/10/2015.
 */
 var _ = require('lodash');
 var Q = require('q');
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

    /*
        by KhanhKC
        this function use to get all order for a store
    */
    function getAllOrder(storeId){            
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
                    statusname = (order['orderstatus'])? order['orderstatus'].dataValues.statusname:'';
                    createDate = order.dataValues.createdate? order.dataValues.createdate:'';
                    completedate = order.dataValues.completedate? order.dataValues.completedate:'';
                    ledgerid = order.dataValues.ledgerid?order.dataValues.ledgerid:'';
                    var fullDeliveryAddress = order.getCustomerAddress();
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
                        'fullDeliveryAddress': fullDeliveryAddress,
                        'iscancel' : order.dataValues.iscancel

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
                        totalNewOrder++;
                        if(item['isdraff']) {
                            group['Draff'].push(item);
                            totalNewOrder--;
                        }else if(_.isEqual(item['statusname'],'Done')|| _.isEqual(item['statusname'],'Cancel') ){
                            group['Done'].push(item);
                            totalNewCod = totalNewCod + parseInt(item.cod);
                            totalNewFee = totalNewFee + parseInt(item.fee);
                        }else {
                            group['Inprocess'].push(item);
                        }                        

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

                return group;
                
                }, function (err) {
                   throw err;
            });
    }

/*
    *By Khanh KC
    *This function use to calculateShipper for an Order 
    */
    var calculateShipFee = function(district, innerCity, ordertypeid){
        if(district && innerCity && ordertypeid){
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
        }else{
            return "Undefind";
        }
        
    }; 

/*
     * By KhanhKC - 14/11/2015
     * This function is used to caculate over weight fee of order       
*/
    var calculateOverWeightFee = function (district, innerCity, listgoods){
        if(district && innerCity && listgoods){
            var totalWeight = 0;
            var overWeightFee = 0;
            for(var i = 0; i <listgoods.length;i++){
                totalWeight = totalWeight + listgoods[i].weight*listgoods[i].amount;
            }                  
            if(totalWeight > 4000 ){

                if(innerCity.indexOf(district)> -1){
                    overWeightFee = (totalWeight - 4000)*2*2;

                }else {
                    overWeightFee = (totalWeight - 4000)*2*2.5;
                }

            }
            return overWeightFee;    
        }else {
            return "Undefind";
        }
        
    }

/*
    * By KhanhKC
    * This function is use to create confirm codes for an Order
    */
    var GenerateRandomCode = function(length){
        var code = "";
        var chars = "123456789";
        for( var i=0; i < length; i++ )
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    }

/*
    * By KhanhKC
    * This function is use to add an Order to database
    */

function postOneOrder(data){
    if(data){
        var newOrder = data.order;
        /*
         * By HuyTDH - 09/10/2015
         * This function is used to create ID for order       
         */
         var str = "000000" + parseInt(Math.random()*1000000);
         var formatStr = str.substr(str.length - 6);
         var newOrderID = "OD" + formatStr;
         newOrder.orderid = newOrderID;
         /*end*/
         var district = data.order.deliverydistrictid;
         var innerCity = config.filterLocation.in;
         var ordertypeid = data.order.ordertypeid;
         var fee = calculateShipFee (district, innerCity,ordertypeid);         
         var overWeightFee = calculateOverWeightFee (district, innerCity,data.goods)

         newOrder.storeid = data.order.storeid;
         newOrder.ordertypeid = data.order.ordertypeid;
         newOrder.pickupaddress = data.order.pickupaddress;
         newOrder.deliveryaddress = data.order.deliveryaddress;
         newOrder.recipientphone = data.order.recipientphone;
         newOrder.recipientname = data.order.recipientname;
         newOrder.statusid = data.order.statusid;
         newOrder.ispending = 'false';
         newOrder.isdraff = data.order.isdraff;   
         newOrder.ledgerid = null;   
         newOrder.createdate = new Date();         
         newOrder.pickupdate = null;
         newOrder.completedate = null;
         newOrder.fee = fee; 
         newOrder.overweightfee = overWeightFee;
         newOrder.deliveryprovinceid = data.order.deliveryprovinceid;
         newOrder.deliverydistrictid = data.order.deliverydistrictid;
         newOrder.deliverywardid = data.order.deliverywardid;
         newOrder.cod = parseInt(data.order.cod)?parseInt(data.order.cod):0;
         // console.log(newOrder.createdate);

        var code1 = {'codecontent' : parseInt(data.order.gatheringCode),'typeid' : 2,'orderid' : newOrder.orderid};
        var code2 = {'codecontent' : parseInt(data.order.deliverCode),'typeid' : 6,'orderid' : newOrder.orderid}; 
        var code3 = {'codecontent' : GenerateRandomCode(6),'typeid' : 3,'orderid' : newOrder.orderid};        
        var code4 = {'codecontent' : GenerateRandomCode(6),'typeid' : 5,'orderid' : newOrder.orderid};
        var code5 = { 'codecontent' : GenerateRandomCode(6),'typeid' : 4, 'orderid' : newOrder.orderid};
        return db.order.postOneOrder(newOrder)
        .then(function (order) {
            db.confirmationcode.postOneCode(code1);
            db.confirmationcode.postOneCode(code2);
            db.confirmationcode.postOneCode(code3);
            db.confirmationcode.postOneCode(code4);
            db.confirmationcode.postOneCode(code5);
            for(var i = 0; i < data.goods.length; i++){
                var good = {};                    
                good.orderid = newOrderID;
                good.stockid = null;
                good.goodsname = data.goods[i].goodsname;
                good.description = data.goods[i].description;
                good.weight = parseInt(data.goods[i].weight);
                good.lengthsize = parseInt(data.goods[i].lengthsize);
                good.widthsize = parseInt(data.goods[i].widthsize);
                good.heightsize = parseInt(data.goods[i].heightsize);
                good.amount = parseInt(data.goods[i].amount);
                db.goods.postOneGood(good).then(function(goodsObj){

                });

            }
            var response = order.toJSON();
            response.customerAddress = order.getCustomerAddress();
            return response;

        },function(err){
            console.log('orderManage.js:274', err);
            throw err;
        });    
    }else{ return "data is empty"}
    
}

/*
    By KhanhKC
    This function is use to update order when user edit info of an order
*/
function updateOrder(req){
    if(req){
    var district = req.body.order.deliverydistrictid;
    var innerCity = config.filterLocation.in;
    var updateOrder = req.body.order;
    var order = updateOrder; 
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
    order.cod = updateOrder.cod;
    order.overweightfee = calculateOverWeightFee (district, innerCity, listupdateGoods);

    return db.order.getOneOrder(updateOrder.orderid)
    .then(function(orderRs){
        if(orderRs.storeid == clStoreid){
            db.goods.deleteGood(updateOrder.orderid)
            .then(function(){
                db.order.updateOrder(order,updateOrder.orderid)
                .then(function(){   
                    var d = Q.defer();                         
                        for(var i =0; i <listupdateGoods.length;i++){
                            var updateGoods = listupdateGoods[i];
                            var newGoods = {
                                goodsname  : updateGoods.goodsname,
                                orderid    : updateOrder.orderid,
                                weight     : updateGoods.weight,
                                lengthsize : updateGoods.lengthsize,
                                widthsize  : updateGoods.widthsize,
                                heightsize : updateGoods.heightsize,
                                description: updateGoods.description,
                                amount     : updateGoods.amount
                            }
                            db.goods.postOneGood(newGoods)                        
                        }
                    d.resolve(true);
                    return d.promise;
                })
            })           
          
        }else {
            throw err;
        }
    })    
    }else{return "Data is empty"};
    
}

var updateExpressOrder = function (req, res, next) {
 var order = req.body.order;
 return db.order.updateExpressOrder({
     statusid : order.statusId,
     isdraff: order.isDraff,
 },order.orderId)
 .then(function (rs) {
    res.status(201).json(rs);
}, function (err) {
 next(err);
})
};

/* 
    by KhanhKC
    this function use to delete an Order
*/
  
    function deleteOrder(orderId){
        var deleteGoods = db.goods.deleteGood(orderId);
        var deleteCode = db.confirmationcode.deleteConfirmCode(orderId);
        return Promise.all([deleteCode,deleteGoods]).then(function(data){
            throw new Error("Delete draft fail!");
            db.order.deleteDraffOrder(orderId)
            .then(function(err) {
                throw err;
            }, function(err) {
                throw  err;
            });
        },function(err){
            throw err;
        });
    }

    var putDraff = function(req, res, next){
        db.order.submitDraffOrder(req.body.orderid)
        .then(function(){
            res.sendStatus(200);
        }, function(err) {
            next(err);
        });
    };

/*
* Store request cance order
* @author: quyennv - 11/11
*/

var cancelOrder = function (ownerStoreUser, storeID, orderID) {

    if(_.isNull(ownerStoreUser) || _.isNull(storeID) || _.isNull(orderID)) {
        throw new Error('NullException');
    }

    var issueCancel = {
        typeid: 7,
        description: 'Store ' + storeID +  ' request cancel',
        isresolved: false,
        resolvetype: null,
        createddate: new Date(),
        sender: ownerStoreUser
    };

   //Add new issue
   return db.issue.createNewIssue(issueCancel)
   .then(function(issue){
        //create new orderissue
        var newOrderIssue = {};
        newOrderIssue.issueid = issue.issueid;
        newOrderIssue.orderid = _.clone(orderID, true);
        db.orderissue.createOrderIssue(newOrderIssue);

        //msg to Admin
        var msgRequestCancel = {
            type: 'issue',
            title: 'Issue',
            content: 'Store ' + storeID + ' requested cancel an order',
            url: '#/admin/issueBox/content?issueid=' + issue.dataValues.issueid,
            isread: false,
            createddate: new Date()
        };

        //Update isCancel = true
        db.order.getOneOrder(orderID)
        .then(function(orders){
            orders = orders.toJSON();
            orders.iscancel = true;
            return db.order.updateOrderStatus(orders);
        })
        .then(function(data){
            //get Admin
            return db.user.getUserByRole(3)
        })
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

        return true;

    });
    }, function(err){
        throw err;
    })
};

var getOrderList = function (req, res, next) {
    var list = [];
    db.order.getAllOrder(db.orderstatus, db.ordertype, db.store)
    .then(function(orderList){
        orderList = orderList.map(function (order) {
            var add = order.getCustomerAddress();
                //console.log(add);
                order = order.toJSON();
                order['deliveryaddress'] = add;
                //var newOrder = _.clone(order.toJSON());
                //list.push(newOrder);
                return order;
            });

        res.status(200).json(orderList);
    }, function(err) {
        next(err);
    });
};

var getTodayTotal = function (req, res, next) {
    var total = new Object();
    db.order.getTodayTotalDelivery()
    .then(function(fee){
           // console.log(fee);
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


/*
    By KhanhKC
    This function is use to get list order of a store
*/
function storeGetOrderList (storeId){
    var orderStatus = db.orderstatus;
    return db.order.storeGetAllOrders(db.orderstatus,db.ordertype,storeId)
    .then(function(list){

        var tempList = [];

        list.forEach(function(order,index){
            if(!order.isdraff){
                tempList.push(order.toJSON());
            }
        })

        tempList = tempList.map(function(order, index) {
            order.fullDeliveryAddress = list[index].getCustomerAddress(); 
            return order;    
        });

         return tempList;
    }, function(err) {
        throw err;
    });
};

var countOrder = function (req, res, next){
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
    postOneOrder: postOneOrder,
    params: params,
    updateExpressOrder : updateExpressOrder,
    updateOrder : updateOrder,
    deleteOrder : deleteOrder,
    putDraff : putDraff,
    cancelOrder: cancelOrder,
    getOrderList: getOrderList,
    getTodayTotal: getTodayTotal,
    storeGetOrderList : storeGetOrderList,
    countOrder : countOrder,
    calculateShipFee : calculateShipFee,
    calculateOverWeightFee: calculateOverWeightFee
}
}