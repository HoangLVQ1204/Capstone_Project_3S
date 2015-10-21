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
      getAllTaskOfShipper: function(taskOrder, orderStatusModel, shipperid, taskdate) {
        return order.findAll({
          include: [{
            model: taskOrder,
            where: {
              shipperid: shipperid,
              taskdate: taskdate
            }
          },{
            model: orderStatusModel
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
      }
    }
  });
  return order;
};
