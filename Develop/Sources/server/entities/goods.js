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
    stockid: {
      type: DataTypes.INTEGER,
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
      },
      postOneGood: function(newGood){
        return goods.build(newGood).save();
      },

      deleteGood: function (orderid) {
        goods.destroy({
          where: {
            orderid: orderid
          }
        });
      },

      putOrder: function (currentOrder) {
        return currentOrder.save();
      }
    }
  });
  return goods;
};
