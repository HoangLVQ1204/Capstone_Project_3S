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
      allowNull: true,
      primaryKey: true
    },
    ordertypeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
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
      allowNull: true,
      primaryKey: true
    },
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
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
      },
      getAllTaskOfShipper: function(task, orderstatus, shipperid, taskdate) {
        return order.findAll({
          attributes: ['orderid', 'ordertypeid', 'pickupaddress', 'deliveryaddress', 'pickupdate', 'deliverydate', 'statusid'],
          include: [{
            model: task,
            attributes: ['tasktype', 'taskdate'],
            where: {
              shipperid: shipperid,
              taskdate: taskdate
            }
          },{
            model: orderstatus,
            attributes: ['statusname']
          }
          ]
        });
      },
	  
      getOrderDetailById: function (orderStatusModel, goodsModel, orderid) {
        return order.findOne({
          attributes:{ exclude: ['ledgerid','statusid']},
          where: {
            //orderid: orderid
          },
          include: [{
            model: orderStatusModel,
            attributes: [['statusname','status']]
          }, {
            model: goodsModel
          }]
        });
	  },
	  
      getAllOrders: function (oderstatusModel, store_id) {
        return order.findAll({
          attributes: ['orderid','deliveryaddress','recipientname','recipientphone','statusid'],
          include: [
            {'model': oderstatusModel}
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

      putOrder: function (currentOrder) {
        return currentOrder.save();
      }
    }
  });
  return order;
};
