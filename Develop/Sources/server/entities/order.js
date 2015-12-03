/* jshint indent: 2 */
var moment         = require('moment');
module.exports = function(sequelize, DataTypes) {
  var order =  sequelize.define('order', {
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stockid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ordertypeid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pickupaddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deliveryaddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pickupdate: {
      type: DataTypes.DATE,
      allowNull: true
    },    
    createdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    recipientphone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recipientname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ispending: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    iscancel: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isdraff: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },    
    fee: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cod: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    overweightfee: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    deliveryprovinceid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deliverydistrictid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deliverywardid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pickupaddresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deliveryaddresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    instanceMethods: {
      updateOrderStatus: function (nextStatus, completeDate, stockID) {
        return this.update({
          statusid: nextStatus,
          completedate: completeDate,
          stockid: stockID
        })
      },
      getCustomerAddress: function(){
        var addressList = require("../config/address.json");
        var address = (this.deliveryaddress) ? this.deliveryaddress : '';
        var wardText = (this.deliverywardid) ? addressList.ward[this.deliverywardid] : '';
        var districtText = (this.deliverydistrictid) ? addressList.district[this.deliverydistrictid] : '';
        var provinceText = (this.deliveryprovinceid) ? addressList.province[this.deliveryprovinceid] : '';
        return address + ', ' + wardText + ', ' + districtText + ', ' + provinceText;
      }
    },
    classMethods: {
      associate: function(db) {
        order.belongsTo(db.orderstatus, {
          foreignKey: 'statusid',
          constraints: false
        });

        order.belongsTo(db.store, {
          foreignKey: 'storeid',
          constraints: false
        });
        order.hasMany(db.task, {
          foreignKey: 'orderid',
          constraints: false
        });
        order.hasMany(db.goods,{
          foreignKey:'orderid',
          constraints: false
        });
        order.hasMany(db.confirmationcode,{
          foreignKey:'orderid',
          constraints: false
        });
        order.belongsTo(db.ordertype, {
          foreignKey: 'ordertypeid',
          constraints: false
        });

        order.belongsTo(db.stock, {
          foreignKey: 'stockid',
          constraints: false
        });

      },
      getAllTaskOfShipper: function(task, shipperid) {
        return order.findAll({
          attributes: ['orderid', 'ordertypeid', 'ispending', 'pickupaddress', 'deliveryaddress', 'pickupdate', 'completedate', 'statusid'],
          //where: {'ispending': false},
          include: [{
            model: task,
            attributes: ['taskid', 'typeid', 'statusid', 'taskdate'],
            where: {
              shipperid: shipperid,
              //taskdate: taskdate,
              statusid: [1, 2, 4]
            }
          }]
        });
      },

      getLastestTasksOfShipper: function(task, shipperid) {
        return order.findAll({
          attributes: ['orderid'],
          include: [{
            model: task,
            attributes: ['taskid'],
            where: {
              shipperid: shipperid,
              statusid: [2]
            }
          }]
        });
      },

      getStoresOfOrder: function(orderIDs) {
        return order.findAll({
          attributes: ['storeid'],
          where: {
            orderid: orderIDs
          }
        });
      },

      getOrderDetailById: function (taskID, shipperID, orderStatusModel, goodsModel, taskModel, storeModel, stockModel) {
        return order.findOne({
          attributes:{ exclude: ['ledgerid', 'createdate', 'isdraff', 'pickupaddresscoordination', 'deliveryaddresscoordination']},
          where: {
            isdraff: false
          },
          include: [
            {
              model: orderStatusModel,
              attributes: [['statusname', 'status']]
            },
            {
              model: goodsModel,
              attributes: {exclude: ['goodsid', 'orderid']}
            },
            {
              model: taskModel,
              attributes: ['taskid', 'statusid', 'typeid'],
              where: {
                taskid: taskID,
                shipperid: shipperID
              }
            },
            {
              model: storeModel,
              attributes: ['name', 'phonenumber'],
            },
            {
              model: stockModel,
              attributes: ['name', 'address'],
            }
          ]
        });
      },
      //KhanhKC
      storeGetAllOrders: function (oderstatusModel,ordertypeModel, store_id) {
        return order.findAll({
          attributes: ['orderid','recipientname','recipientphone','statusid','isdraff','ispending','iscancel','cod','fee','completedate','deliveryaddress','createdate','ledgerid','deliverydistrictid','deliveryprovinceid','deliverywardid'],
          where: {storeid:store_id },
          include: [
            {'model': oderstatusModel,
              attributes: ['statusname']
            },{
              'model': ordertypeModel,
              attributes: ['typename']
            }
          ],
          order: 'createdate DESC'
        }).then(sequelize.handler);
      },

      storeGetOneOrder: function (oderstatusModel, goodsModel,confirmationCodeModel, order_id) {
        return order.findOne({         
          where: {orderid:order_id},
          include: [
            {'model': oderstatusModel,
              attributes: ['statusname']
            },
            {
              'model': goodsModel
            },
            {
              'model':confirmationCodeModel
            }
          ]
        });
      },

      getOneOrder: function (order_id) {
        return order.findOne({
          where: {
            'orderid': order_id
          }
        })
      },


      postOneOrder: function(newOrder){
        return order.build(newOrder).save();
      },

      updateExpressOrder: function (currentOrder, orderID) {
          return order.update(
              currentOrder,{
            where: {
              'orderid': orderID
            }
          });
      },

      changeIsPendingOrder: function(orderID, isPending) {
         return order.update(
             {ispending: isPending},
             {where: {
               'orderid': orderID
             }}
         );
      },

      submitDraffOrder: function(orderid) {
        return order.update(
            {
              isdraff: 'false',
              statusid: 1
            },
            { where: { orderid: orderid }} /* where criteria */
        )
		  },

      getTotalShipFeeOfStore: function(storeid, paydate){
        return order.sum('fee',{
          where: {
            'storeid': storeid,
            'ledgerid': null,
            'completedate': {gte: paydate},
            'statusid':  [7, 8]
          }
        })
      },

      deleteDraffOrder: function (orderid) {
        return order.destroy(
            { where: { orderid: orderid }}
        )
		},

  		getTotalShipCoDOfStore: function(storeid, paydate){
          return order.sum('cod',{
            where: {
              'storeid': storeid,
              'ledgerid':  null,
              'completedate': {gte: paydate},
              'statusid':  [7, 8]
            }
          })
        },

      cancelOrder: function(orderid) {
        return order.update(
            {
              iscancel: 'true',
              statusid: 'Canceling',
              fee:5000
            },
            { where: { orderid: orderid }} /* where criteria */
        )
	},

	 updateLedgerForOrder: function(storeid, paydate, ledgerid){
        return order.update(
            {'ledgerid': ledgerid},
            {
          where: {
            'storeid': storeid,
            'ledgerid':  null,
            'completedate': {lt: paydate},
            'statusid': [7, 8]
          }
        }).then(sequelize.handler)
      },



      getAllOrderToAssignTask: function(orderstatus, task, taskstatus){
        return order.findAll({
          attributes: ['orderid', 'storeid','pickupaddress','statusid','deliveryaddress','deliveryprovinceid',
          'deliverydistrictid', 'deliverywardid', 'iscancel'],
          where: {
            'statusid': {$or: [1,4]},
            'ispending': false
          },
          include: [{
            model: orderstatus,
            attributes: ['statusname']
          },
            {
              model: task,
              required: false,
              include:{
                model: taskstatus,
                attributes: ['statusname']
              },
              where: {
                'statusid': {$ne: 5}
              }
            }]
        })
      },

      getTaskBeIssuePending: function(task, issue, issuetype, orderissue, shipperId) {
        return order.findAll({
          attributes: ['orderid', 'ispending'],
          where: {'ispending': true},
          limit: 1,
          order: '"createddate" DESC',
          include: [{
            model: orderissue,
            attributes: ['issueid'],
            include: [{
              model: issue,
              attributes: ['typeid', 'isresolved'],
              //where: {isresolved: false},
              include: [{
                model: issuetype,
                attributes: ['categoryid'],
                where: {'categoryid': 1}
              }]
            }]
          },{
            model: task,
            attributes: ['taskid', 'shipperid', 'statusid'],
            where: {'shipperid': shipperId}
          }]
        });
      },

      getAllTaskCancel: function(task, issue, issuetype, orderissue, shipperid) {
        return order.findAll({
          attributes: ['orderid'],
          include: [{
            model: task,
            attributes: ['taskid'],
            where: {
              shipperid: shipperid,
              // taskdate: taskdate,
              statusid: [1, 2]
            }
          },{
            model: orderissue,
            attributes: ['orderid'],
            include: {
              model: issue,
              attributes: ['issueid'],
              where: {'isresolved': false},
              include:{
                model: issuetype,
                attributes: ['categoryid'],
                where: {'categoryid': 2}
              }
            }
          }]
        });
      },

      getAllOrder: function (oderstatusModel,ordertypeModel, storeModel) {
        return order.findAll({
          where: {statusid: {$ne: null} },
          include: [
            {'model': oderstatusModel,
              attributes: ['statusname']
            },{
              'model': ordertypeModel,
              attributes: ['typename']
            },{
              'model': storeModel,
              attributes: ['name']
            }
          ]
        });
      },
      //// HuyTDH - 12-11-15
      shipperGetOneOrder: function (taskid, orderid, shipper, modelTask) {
        return order.findOne({
          where: {orderid: orderid},
          include:[
            {
              'model': modelTask,
              where: {
                shipperid: shipper,
                taskid: taskid,
                statusid: {
                  $in: [1, 2]
                }
              }
            }
          ]
        })
      },

      //// HoangNK - get total delivery and cod of day
      getTodayTotalDelivery: function () {
        //console.log( moment().format('DD/MM/YYYY'));
        return order.sum('fee',{
          where: {
            completedate: moment().format(),
            statusid: [7,8]
          }
        })
      },

      getTodayTotalCoD: function () {
        //console.log( moment().format('DD/MM/YYYY'));
        return order.sum('cod',{
          where: {
            completedate: moment().format(),
            statusid: [7,8]
          }
        })
      },

      updateOrderStatus: function (newOrder) {//change status of order
        return order.update(
            {'statusid': newOrder.statusid, 'ispending': newOrder.ispending, 'iscancel': newOrder.iscancel},
            {
              where: {
                'orderid': newOrder.orderid
              }
            })
      },

      updateOrderAfterStoreCancel: function (newOrder) {//change status of order
        return order.update(
            {'statusid': newOrder.statusid,
              'fee': newOrder.fee
            },
            {
              where: {
                'orderid': newOrder.orderid
              }
            })
      },

       updateOrder: function (currentOrder,orderid) {
        return order.update(
          currentOrder,
          {
            where:{
              'orderid': orderid
            }
          })
      },

      countOrder: function(storeid){
        if(storeid == 'all'){
          return order.findAll({
            attributes: [
                               
                [
                    sequelize.fn('date_part',
                        'month',
                        sequelize.col('createdate')
                    ),
                    'Month'
                ],
                [
                    sequelize.fn('count',
                        sequelize.col('orderid')
                    ),
                    'count'
                ] 
            ],            
            group: ['"Month"']
        })
        } else {
          return order.findAll({
            attributes: [
                               
                [
                    sequelize.fn('date_part',
                        'month',
                        sequelize.col('createdate')
                    ),
                    'Month'
                ],
                [
                    sequelize.fn('count',
                        sequelize.col('orderid')
                    ),
                    'count'
                ] 
            ],
            where:{
              'storeid' : storeid
            },
            group: ['"Month"']
        })
        }

      },

      adminGetAllStatisticOrders: function () {
        return order.findAll({
          attributes: [
            ['storeid', 'store'],
            [
              sequelize.fn('date_part',
                  'year',
                  sequelize.col('createdate')
              ),
              'year'
            ],
            [
              sequelize.fn('date_part',
                  'month',
                  sequelize.col('createdate')
              ),
              'month'
            ],
            ['ordertypeid', 'type'],
            [
              sequelize.fn('count',
                  sequelize.col('orderid')
              ),
              'count'
            ]
          ],
          group: ['storeid', 'year', 'month', 'type'],
          order: ['store', 'month']
        })
      },

      adminGetMoneyStatisticOrders: function () {
        return order.findAll({
          attributes: [
            ['storeid', 'store'],
            [
              sequelize.fn('date_part',
                  'year',
                  sequelize.col('createdate')
              ),
              'year'
            ],
            [
              sequelize.fn('date_part',
                  'month',
                  sequelize.col('createdate')
              ),
              'month'
            ],
            ['ordertypeid', 'type'],
            [
              sequelize.fn('sum',
                  sequelize.col('fee')
              ),
              'feeSum'
            ],
            [
              sequelize.fn('sum',
                  sequelize.col('cod')
              ),
              'codSum'
            ]
          ],
          group: ['storeid', 'year', 'month', 'type'],
          order: ['store', 'month']
        })
      },

      adminCountOrdersDoneOrFail: function () {
        return order.findAll({
          attributes: [
            ['storeid', 'store'],
            [
              sequelize.fn('date_part',
                  'year',
                  sequelize.col('createdate')
              ),
              'year'
            ],
            [
              sequelize.fn('date_part',
                  'month',
                  sequelize.col('createdate')
              ),
              'month'
            ],
            ['statusid', 'status'],
            [
              sequelize.fn('count',
                  sequelize.col('orderid')
              ),
              'count'
            ]
          ],
          where: {
            'statusid': {
              $in: [7, 8]
            }
          },
          group: ['storeid', 'year', 'month', 'status'],
          order: ['store', 'month']
        })
      },

      adminCountAllOrder:function(){
        return order.findAll({
          attributes: ['storeid', 
            [sequelize.fn('count', sequelize.col('orderid')),'numberOrder'],
            [sequelize.fn('sum',sequelize.col('fee')),'totalFee']
          ], 
          group: ['storeid']
   
        })
      },

      getManyOrder: function(orderIDs){
        return order.findAll({
          attributes: ['orderid'],
          where: {
            'orderid': orderIDs,
            'statusid': [8, 6]
          }
        })
      }


    }
  });
  return order;
};
