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
      allowNull: true,
    },
    ispending: {
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
      updateOrderStatus: function (nextStatus, completeDate) {
        return this.update({
          statusid: nextStatus,
          completedate: completeDate
        })
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

      getStoresOfOrder: function(orderIDs) {
        return order.findAll({
          attributes: ['storeid'],
          where: {
            orderid: orderIDs
          }
        });
      },

      getOrderDetailById: function (taskID, shipperID, orderStatusModel, goodsModel, taskModel) {
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
            }
          ]
        });
      },
      //KhanhKC
      storeGetAllOrders: function (oderstatusModel,ordertypeModel, store_id) {
        return order.findAll({
          attributes: ['orderid','deliveryaddress','recipientname','recipientphone','statusid','isdraff','ispending','cod','fee','completedate','createdate','ledgerid'],
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
        });
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
        })
      },



      getAllOrderToAssignTask: function(orderstatus, task, taskstatus){
        return order.findAll({
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
          //where: {storeid:store_id },
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
                taskid: taskid
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
            {'statusid': newOrder.statusid },
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
      }

    }
  });
  return order;
};
