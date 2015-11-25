/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var goods = sequelize.define('goods', {
    goodsid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goodsname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lengthsize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    widthsize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    heightsize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        goods.belongsTo(db.order, {
          foreignKey: 'orderid'
        });
      },
      postOneGood: function(newGood){
        return goods.build(
          {
            goodsname: newGood.goodsname,
            orderid: newGood.orderid,
            stockid: newGood.stockid,
            weight: parseFloat(newGood.weight),
            lengthsize: parseFloat(newGood.lengthsize),
            widthsize: parseFloat(newGood.widthsize),
            heightsize: parseFloat(newGood.heightsize),
            description: newGood.description,
            amount: newGood.amount
          }
        ).save();
      },

      deleteGood: function (orderid) {
        return goods.destroy({
          where: {
            orderid: orderid
          }
        });
      },


      updateGoods: function (currentGoods,goodsid) {
        return goods.update(
          currentGoods,
          {
            where:{
              'goodsid': goodsid
            }
          })
      },

      putOrder: function (currentOrder) {
        return currentOrder.save();
      },

      // HuyTDH check gooods belongs to order of store
      checkGoodsBelongStore: function(goodsid, storeid, orderModel){
        return goods.findOne({
          where: {
            goodsid: goodsid
          },
          include:{
            model: orderModel,
            where: {
              storeid: storeid
            }
          }
        })
      },

      // HuyTDH 18-11-2015: delete goods by goodsid
      deleteGoodsByID: function (goodsid) {
        return goods.destroy({
          where: {
            goodsid: goodsid
          }
        });
      }
    }
  });
  return goods;
};
