/* jshint indent: 2 */

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
    deliverydate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    donedate: {
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
    iscancel: {
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
    classMethods: {
      associate: function(db) {
        order.belongsTo(db.orderstatus, {
          foreignKey: 'statusid',
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

      },
      getAllTaskOfShipper: function(task, shipperid, taskdate) {
        return order.findAll({
          attributes: ['orderid', 'ordertypeid', 'ispending', 'pickupaddress', 'deliveryaddress', 'pickupdate', 'deliverydate', 'statusid'],
          //where: {'ispending': false},
          include: [{
            model: task,
            attributes: ['taskid', 'typeid', 'statusid', 'taskdate'],
            where: {
              shipperid: shipperid,
              taskdate: taskdate,
              statusid: [1, 2]
            }
          }]
        });
      },

      getOrderDetailById: function (orderStatusModel, goodsModel, orderid) {
        return order.findOne({
          attributes:{ exclude: ['ledgerid']},
          where: {
            orderid: orderid
          },
          include: [{
            model: orderStatusModel,
            attributes: [['statusname','status']]
          }, {
            model: goodsModel,
            limit: 1
          }]
        });
      },
      //KhanhKC
      storeGetAllOrders: function (oderstatusModel, store_id) {
        return order.findAll({
          attributes: ['orderid','deliveryaddress','recipientname','recipientphone','statusid','isdraff','iscancel','ispending','cod','fee','donedate','createdate'],
          include: [
            {'model': oderstatusModel,
              attributes: ['statusname']
            }
          ]
        });
      },

      storeGetOneOrder: function (oderstatusModel, goodsModel,confirmationCodeModel, order_id) {
        return order.findOne({
          attributes: ['orderid','deliveryaddress','recipientname','recipientphone','statusid','isdraff','iscancel','ispending','cod','fee','donedate','createdate'],
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

      putOrder: function (order) {
        return order.save();
      },

      postOneOrder: function(newOrder){
        return order.build(newOrder).save();
      },

      putOrder: function (currentOrder) {
        return currentOrder.save();
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
        order.update(
            {
              isdraff: 'false',
              statusid: 1
            },
            { where: { orderid: orderid }} /* where criteria */
        )
      },

      deleteDraffOrder: function (orderid) {
        order.destroy({
          where: {
            orderid: orderid
          }
        });
      },

      cancelOrder: function(orderid) {
        order.update(
            {
              iscancel: 'true',
              statusid: 'Canceling',
              fee:5000
            },
            { where: { orderid: orderid }} /* where criteria */
        )
      },
      getTaskBeIssuePending: function(task, issue, issuetype, orderissue, shipperId) {
        return order.findAll({
          attributes: ['orderid', 'ispending'],
          where: {'ispending': true},
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
      }
    }
  });
  return order;
};
