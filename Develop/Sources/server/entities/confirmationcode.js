/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var confirmationcode = sequelize.define('confirmationcode', {
    codeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    codecontent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
      },
      postOneCode: function(newCode){
        return confirmationcode.build(
          {
            codecontent: newCode.codecontent,
            typeid: newCode.typeid,
            orderid: newCode.orderid
          }
        ).save();
      },

      deleteConfirmCode: function (orderid) {
        confirmationcode.destroy({
          where: {
            orderid: orderid
          }
        });
      },

      putOrder: function (currentOrder) {
        return currentOrder.save();
      },

      checkCode: function (orderid, code, type) {
        return confirmationcode.findOne({
          where: {
            orderid: orderid,
            codecontent: code,
            typeid: type
          }
        });
      }
    }
  });
  return confirmationcode;
};
