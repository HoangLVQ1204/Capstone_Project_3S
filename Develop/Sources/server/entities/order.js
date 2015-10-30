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
        order.hasOne(db.store,{
          foreignKey:'storeid',
          constraints: false
        });
      },
      getAllTaskOfShipper: function(task, shipperid, taskdate) {
        return order.findAll({
          attributes: ['orderid', 'ordertypeid', 'pickupaddress', 'deliveryaddress', 'pickupdate', 'deliverydate', 'statusid'],
          where: {'ispending': false},
          include: [{
            model: task,
            attributes: ['typeid', 'statusid', 'taskdate'],
            where: {
              shipperid: shipperid,
              taskdate: taskdate,
              statusid: [1, 2]
            }
          }
          ]
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
          attributes: ['orderid','deliveryaddress','recipientname','recipientphone','statusid','isdraff','iscancel','ispending'],
          include: [
            {'model': oderstatusModel,
              attributes: ['statusname']
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

      
      changeIsPendingOrder: function(orderID) {
        //listOrders.forEach(function(item) {
          order.update(
              { ispending: 'true' },
              { where: { orderid: orderID }}
          )
        //});
      },

      getTotalShipFeeOfStore: function(storeid, paydate){
       // console.log(paydate)
        return order.sum('fee',{
          where: {
            'storeid': storeid,
            'ledgerid': null,
            'deliverydate': {gte: paydate},
            'statusid': { $between: [6, 8]}
          }
        })
      },

      getTotalShipCoDOfStore: function(storeid, paydate){
        return order.sum('cod',{
          where: {
            'storeid': storeid,
            'ledgerid':  null,
            'deliverydate': {gte: paydate},
            'statusid': { $between: [6, 8]}
          }
        })
      },

      updateLedgerForOrder: function(storeid, paydate, ledgerid){
        return order.update(
            {'ledgerid': ledgerid},
            {
          where: {
            'storeid': storeid,
            'ledgerid':  null,
            'deliverydate': {lt: paydate},
            'statusid': { $between: [6, 9]}
          }
        })
      },

      getAllOrderToAssignTask: function(orderstatus){
        return order.findAll({
          where: {
            'statusid': {$or: [1,2,5,6]}
          },
          include: [{
            model: orderstatus,
            attributes: ['statusname']
          }]
        })
      }

    }
  });
  return order;
};
